import Stripe from 'stripe'
import { stripe } from '../helpers'
import { validateCode } from '../login'

const StripeFields = (fields: Array<string>) => ({
  element: (el: Element) => {
    el.append(`<script id="stripe_payment_intents" type="application/json">${JSON.stringify(fields)}</script>`, { html: true })
  }
})

export default async (request: Request, response: Response): Promise<Response> => {
  const url = new URL(request.url)
  const sessionId = url.searchParams.get("stripe_session_id")
  let customer
  if (sessionId) {
    const session: Stripe.Checkout.Session = await stripe(`/checkout/sessions/${sessionId}`, null, 'GET')
    customer = session.customer
  }

  const loginCode = url.searchParams.get("login")
  if (loginCode) {
    const {email} = await validateCode(encodeURIComponent(loginCode))
    const customers: Stripe.ApiList<Stripe.Customer> = await stripe(`/customers?email=${email}&limit=1`, null, 'GET')
    if (!customers.data.length) throw new Error("Invalid login code")
    customer = customers.data[0].id
  }

  // Should get list of validated products here instead of payment intents

  const paymentIntents: Stripe.ApiList<Stripe.PaymentIntent> = await stripe(`/payment_intents?customer=${customer}`, null, 'GET')
  const fields = paymentIntents.data.map(pi => pi.id)

  return new HTMLRewriter().on('head', StripeFields(fields)).transform(response)
}