import { getAssetFromKV, serveSinglePageApp } from '@cloudflare/kv-asset-handler'

import Bundle from './handlers/bundle'
import Download from './handlers/download'
import NewSession from './handlers/session'
import NotFound from './handlers/notFound'
import Orders from './handlers/orders'
import Webhook from './handlers/webhook'

import { corsHeaders } from './helpers'

addEventListener('fetch', (event) => {
  event.respondWith(router(event))
})

const router = async (event: FetchEvent) => {
  if (event.request.method === "OPTIONS") {
    return new Response('', { status: 204, headers: corsHeaders })
  }

  const url = new URL(event.request.url)

  let resp: Response | Promise<Response>;

  switch (url.pathname) {
    case '/api/session':
      resp = NewSession(event.request)
      break
    case '/api/webhook':
      resp = Webhook(event.request)
      break
    case '/api/download':
      resp = Download(event.request)
      break
    default:
      let asset = await getAssetFromKV(event, { mapRequestToAsset: serveSinglePageApp })
      resp = asset ? asset : NotFound()

      if (url.pathname.startsWith('/bundles')) {
        resp = Bundle(event.request, resp)
        break
      }

      if (url.pathname === "/orders") {
        resp = Orders(event.request, resp)
        break
      }
  }

  return resp
}