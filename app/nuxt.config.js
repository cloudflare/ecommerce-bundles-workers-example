import config from '../config'

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: "static",

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: config.title,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: config.description
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ["@/plugins/sanity-blocks.js"],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    "@nuxtjs/sanity",
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/tailwindcss
    "@nuxtjs/tailwindcss"
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    [
      "nuxt-social-meta",
      {
        title: config.title,
        url: config.url,
        site_name: config.title,
        description: config.description,
        img: config.opengraph_image,
        locale: "en_US",
        twitter: config.twitter,
        twitter_card: "summary_large_image"
      }
    ],

    config.fathom.enabled ? ['@yabhq/nuxt-fathom', {
      siteId: config.fathom.siteId,
      excludedDomains: 'workers.dev,localhost',
      scriptSrc: config.fathom.scriptSrc
    }] : [],
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  sanity: {
    token: process.env.SANITY_TOKEN
  },

  privateRuntimeConfig: {},

  publicRuntimeConfig: {
    ...config,
    stripePublicKey:
      process.env.STRIPE_PUBLIC_KEY ||
      "pk_test_51He2rVLBds0mgkknsHH4EffIQ3IIRpcnvul43koz1Ge2PzkyWtfeGmViH7wIVi959kfJLDWWn0dXekHDtdemoaFx00bP6mmshG" // Defaults to public test key,
  }
};
