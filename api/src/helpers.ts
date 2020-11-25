import config from '../../config'
import qs from 'qs'

export const corsHeaders = {
  "Access-Control-Allow-Headers": CORS_HEADERS,
  "Access-Control-Allow-Origin": CORS_ORIGIN
}

export const json = (body: any, args?: ResponseInit) => new Response(JSON.stringify(body), {
  ...args,
  headers: {
    'Content-type': 'application/json',
    ...corsHeaders
  }
})

export const stripe = async (path: string, body: any, method: string) => {
  const resp = await fetch(`https://api.stripe.com/v1${path}`, {
    ...(method === 'POST' ? {body: qs.stringify(body)} : {}),
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-type': 'application/x-www-form-urlencoded',
      ...corsHeaders
    },
    method
  })

  return await resp.json()
}

export const mailgun = async (path: string, { subject, to, html }: { subject: string, to: string, html: string }) => {
  const resp = await fetch(`https://api.mailgun.net/v3${path}`, {
    body: qs.stringify({
      from: `${config.mailgun.from.name} <${config.mailgun.from.email}>`,
      to,
      subject,
      html
    }),
    headers: {
      Authorization: `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
      'Content-type': 'application/x-www-form-urlencoded',
    },
    method: 'POST'
  })

  return await resp.json()
}

export const sanityQuery = async (query: string, useCdn: boolean = false): Promise<SanityBundleResponse | SanityBundleArrayResponse> => {
  const resp = await fetch(`https://${SANITY_PROJECT_ID}.${useCdn ? 'apicdn' : 'api'}.sanity.io/v1/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`)
  return await resp.json()
}
