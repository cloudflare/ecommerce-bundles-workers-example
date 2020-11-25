import { retrieveByCode } from '../login'
import { sanityQuery } from '../helpers'

const unauthed = () => new Response('Unauthorized', { status: 401 })

export default async (request: Request) => {
  const url = new URL(request.url)

  const login = url.searchParams.get("login")
  const product = url.searchParams.get("product")

  if (!login || !product) return unauthed()

  const kvLogin = await retrieveByCode(encodeURIComponent(login))
  if (!kvLogin) return unauthed()

  const kvCustomer = await retrieveByCode((kvLogin as KVLogin).customer)
  if (!kvCustomer) return unauthed()
  if (!(kvCustomer as KVCustomer).products.includes(product)) return unauthed()

  const query = `*[_type == "bundle" && stripe_product_id == "${product}"]`
  const data: SanityBundleArrayResponse = await sanityQuery(query) as SanityBundleArrayResponse
  const bundle = data.result[0]
  return fetch(bundle.download_url)
}