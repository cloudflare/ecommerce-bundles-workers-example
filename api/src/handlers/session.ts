import config from '../../../config'
import { json, stripe } from '../helpers'

export default async (request: Request): Promise<Response> => {
  const body = await request.json()
  const { price_id } = body

  if (!price_id) {
    return json("Internal server error", { status: 500 })
  }

  const session = await stripe('/checkout/sessions', {
    payment_method_types: ['card'],
    line_items: [
      {
        price: price_id,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${config.url}/thanks`,
    cancel_url: config.url,
  }, 'POST')

  return json({ session_id: session.id })
}
