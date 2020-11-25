export {};
declare global {
  const AUTH_TOKEN: string
  const AWS_ACCESS_KEY: string
  const AWS_SECRET_KEY: string
  const CORS_HEADERS: string
  const CORS_ORIGIN: string
  const ENCRYPTED: KVNamespace
  const LAMBDA_FN: string
  const MAILGUN_API_KEY: string
  const MAILGUN_DOMAIN: string
  const SALT: string
  const SANITY_DATASET: string
  const SANITY_PROJECT_ID: string
  const STRIPE_SECRET_KEY: string
  const STRIPE_WEBHOOK_SIGNING_SECRET: string

  type SanityBundleResponse = {
    result: Bundle
  }
  type SanityBundleArrayResponse = {
    result: Array<Bundle>
  }

  type Product = {
    author: {
      enable_google_sheets_integration: boolean
      google_sheets_id?: string
      stripe_connect_id: string
    }
  }

  type Bundle = {
    download_url: string
    name: string
    slug: string
    fee: boolean
    products: Array<Product>
    open_graph?: {
      title?: string
      description?: string
      image?: string
      image_url?: string
    }
  }

  type KVCustomer = {
    id: string
    products: string[]
  }

  type KVLogin = {
    customer: string
  }
}