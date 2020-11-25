import { AwsClient } from 'aws4fetch'
import Stripe from 'stripe'
import config from '../../../config'
import { json, mailgun, sanityQuery, stripe } from '../helpers'
import { persist, retrieveByCode } from '../login'

const sanityInfoForProduct = async (product: string) => {
  const query = `*[_type == "bundle" && stripe_product_id == "${product}"]{
    name,
    fee,
    products[]->{
      author {
        enable_google_sheets_integration,
        google_sheets_id,
        stripe_connect_id
      }
    },
  }`

  const data: SanityBundleArrayResponse = await sanityQuery(query) as SanityBundleArrayResponse
  const bundle = data.result[0]
  const accountIds = bundle.products.map(product => product.author.stripe_connect_id)

  return { accountIds, bundle }
}

const createTransfersForBundleAuthors = (
  { bundle, price, accountIds, paymentIntent }:
  { bundle: Bundle, price: Stripe.Price, accountIds: string[], paymentIntent: Stripe.PaymentIntent }
) => {
  const fee = bundle.fee
  let base = price.unit_amount as number
  // Subtract Stripe fee from base: 2.9% + 30 cents per tx
  base = (base * 0.971) - 3
  const perAccountIdAmount = Math.floor((fee ? base * 0.95 : base) / accountIds.length)
  const charge: Stripe.Charge = paymentIntent.charges.data[0]
  return accountIds.map((accountId: string) =>
    stripe(`/transfers`, {
      amount: perAccountIdAmount,
      currency: 'usd',
      destination: accountId,
      source_transaction: charge.id
    }, 'POST')
  )
}

async function toLambdaEvent(request: Request) {
  const url = new URL(request.url)
  return {
    httpMethod: request.method,
    path: url.pathname,
    queryStringParameters: [...url.searchParams].reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {}),
    headers: [...request.headers].reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {}),
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text(),
  }
}

const writeToGoogleSheet = async (sheetId: string, email: string, request: Request) => {
  const url = new URL(request.url)
  url.searchParams.set("email", email)
  url.searchParams.set("sheet_id", sheetId)
  const aws = new AwsClient({ accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY })
  const LAMBDA_BASE_URL = 'https://lambda.us-east-1.amazonaws.com/2015-03-31/functions'
  const lambdaRequest = new Request(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": AUTH_TOKEN
    },
    method: "GET"
  })

  return await aws.fetch(`${LAMBDA_BASE_URL}/${LAMBDA_FN}/invocations`, {
    body: JSON.stringify(await toLambdaEvent(lambdaRequest)),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST"
  })
}


const sendMailgunEmail = async ({ bundle, code, email, product }: { bundle: Bundle, code: string, email: string, product: string }) => {
  const html = `<p>Thanks for buying ${bundle.name}!</p> <p>You can download the bundle at the below link. This download link is exclusive to you and should not be shared with anyone else.</p><p><a href='${config.url}/api/download?login=${code}&product=${product}'>Download ${bundle.name}</a></p>`
  return mailgun(`/${MAILGUN_DOMAIN}/messages`, {
    subject: `Your download of ${bundle.name} is ready`,
    to: email,
    html
  })
}

const sessionCompleted = async (event: Stripe.Event, request: Request) => {
  try {
    const session = event.data.object as Stripe.Checkout.Session

    const paymentIntent: Stripe.PaymentIntent = await stripe(`/payment_intents/${session.payment_intent}`, null, 'GET')
    const lineItems = await stripe(`/checkout/sessions/${session.id}/line_items`, null, 'GET')
    const customer: Stripe.Customer = await stripe(`/customers/${session.customer}`, null, 'GET')
    const email = customer.email as string
    const price: Stripe.Price = lineItems.data[0].price
    const product = price.product as string

    // Create a new KV object for storing customer and purchased products
    const kvCustomer = await retrieveByCode(customer.email as string)
    if (!kvCustomer) {
      const newKvCustomer: KVCustomer = {
        id: customer.id,
        products: [product]
      }
      persist({ key: customer.id, data: newKvCustomer })
    } else {
      const existing = kvCustomer as KVCustomer
      if (!existing.products.includes(product)) existing.products.push(product)
      persist({ key: existing.id, data: existing })
    }

    // Store a unique + random code for corresponding public-facing logins and the underlying KVCustomer data
    const login: KVLogin = { customer: customer.id }
    const code = await persist({ data: login })

    const { bundle, accountIds } = await sanityInfoForProduct(product)

    await Promise.all(createTransfersForBundleAuthors({ bundle, price, accountIds, paymentIntent }))
    await sendMailgunEmail({ bundle, code, email, product: product })

    await Promise.all(bundle.products.map(async product => {
      const { enable_google_sheets_integration, google_sheets_id } = product.author
      if (enable_google_sheets_integration && google_sheets_id) {
        console.log(`Writing ${email} to Google Sheet ${google_sheets_id}`)
        const resp = await writeToGoogleSheet(google_sheets_id, email, request)
        console.log(resp)
      }
      return Promise.resolve()
    }))

    return json({ ok: true })
  } catch (err) {
    console.log(err.toString())
    return json({ ok: false, status: 500 })
  }
}

export default async (request: Request): Promise<Response> => {
  // Although the body is JSON, Stripe requires that we pass the raw text
  const body = await request.text()
  try {
    const sig = request.headers.get('stripe-signature')
    if (!sig) throw new Error("No signature provided in header")
    // The Stripe client doesn't work in Workers so we construct a private one here just
    // for verifying the webhook is valid
    const _stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' })
    const event = _stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SIGNING_SECRET)

    switch (event.type) {
      case 'checkout.session.completed':
        return sessionCompleted(event, request)
      default:
        console.log('Unknown webhook event type sent')
        return json({ type: event.type, ok: true })
    }
  } catch (err) {
    return json({ ok: false, error: err.toString() })
  }
}
