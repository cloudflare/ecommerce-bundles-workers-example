export default {
  // The public-facing name of your store.
  title: 'MYSTORE',

  // Short (1-2) sentence description of your store
  description: "Exclusive, timed deals on our favorite stuff.",

  // A contact email used to contact the site admin (used in InfoPanel.vue)
  email: "your@email.com",

  // A publicly-accessible image used in OpenGraph tags when rendering your site
  // on Twitter, Facebook, and other social media tools
  opengraph_image: "https://yoururl.com/opengraph.png",

  // A publicly-accessible square logo image.
  logo: '/logo.png',

  // Your store's Twitter handle, in the format @username.
  twitter: '@mytwitter',

  // Your store's YouTube channel, in the format username.
  youtube: 'myyoutube',

  // The production URL for your store. This should match what you put as your zone in
  // wrangler.toml
  url: 'https://yoururl.com',

  // Optional analytics provided by Fathom.
  fathom: {
    enabled: true,
    // The site ID for your analytics property, found in the Fathom dash
    siteId: 'SITEID',
    // If hosting on a custom domain, uncomment this out
    // scriptSrc: 'https://custom.myurl.com/script.js',
  },

  // Short (1-2) sentence footer text rendered at the bottom of the page
  footerText: "Brought to you by My Company.",

  // Newsletter functionality, which renders a basic form in the footer that links to
  // your mailing list landing page.
  newsletter: {
    enabled: true,
    text: "Join 100,000 people who get our deals, sales and exclusive offers in their inbox every week.",
    url: "https://www.mynewsletter.com"
  },

  // Confirmation/download emails are sent using Mailgun. The below parameters set the from name/email on
  // outgoing emails to customers
  mailgun: {
    from: {
      name: 'MYSTORE',
      email: 'no-reply@yoururl.com'
    }
  }
}