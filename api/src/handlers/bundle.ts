import config from '../../../config'
import { sanityQuery } from '../helpers'

const findBySlug = async (slug: string) => {
  const query = `*[_type == "bundle" && slug == "${slug}"] {
    ...,
    open_graph {
      ...,
      "image_url": image.asset->url
    }
  }`
  const data: SanityBundleArrayResponse = await sanityQuery(query, true) as SanityBundleArrayResponse
  return data.result[0]
}

type Fields = {
  title: string
  description?: string
  image?: string
  url: string
}

const appendTag = (element: Element, obj: { value: string | undefined, fields: string[]}, field: string) => {
  if (!obj.value) return
  switch (field) {
    case 'title':
      element.append(`<title>${obj.value}</title>`, { html: true })
      break
    default:
      element.append(`<meta name="${field}" content="${obj.value}">`, { html: true })
  }
}

const enhanceMeta = (fields: Fields) => {
  const metaFields = [
    { value: fields.title, fields: ["title", "twitter:title", "og:title"] },
    { value: fields.description, fields: ["description", "twitter:description", "og:description"] },
    { value: fields.image, fields: ["image", "twitter:image", "og:image"] },
    { value: fields.url, fields: ["twitter:url", "og:url"] }
  ]

  const AddFields = {
    element: (element: Element) => metaFields.forEach(obj => obj.fields.forEach(field => appendTag(element, obj, field))),
    text: () => {}
  }

  return new HTMLRewriter().on('head', AddFields)
}

export default async (request: Request, response: Response): Promise<Response> => {
  const url = new URL(request.url)
  const match = url.pathname.match(/\/bundles\/(\S*)/)
  const slug = match && match.length ? match[1] : null
  if (!slug) return response
  const bundle = await findBySlug(slug)
  const meta: Fields = {
    title: bundle.name,
    url: `${config.url}/bundles/${bundle.slug}`
  }
  if (bundle.open_graph) {
    if (bundle.open_graph.title) meta["title"] = bundle.open_graph.title
    if (bundle.open_graph.description) meta["description"] = bundle.open_graph.description
    if (bundle.open_graph.image_url) meta["image"] = bundle.open_graph.image_url
  }
  return enhanceMeta(meta).transform(response)
}