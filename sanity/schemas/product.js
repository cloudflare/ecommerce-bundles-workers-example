const Product = {
  title: "Product",
  name: "product",
  type: "document",
  initialValue: {
    enable_google_sheets_integration: false,
  },
  fields: [
    {
      title: "Name",
      name: "name",
      type: "string",
      required: true,
    },
    {
      title: "Description",
      name: "description",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      title: "Image",
      name: "image",
      type: "image",
      required: true,
    },
    {
      title: "Author",
      name: "author",
      type: "object",
      required: true,
      fields: [
        {
          title: "Name",
          name: "name",
          type: "string",
          required: true,
        },
        {
          title: "Description",
          name: "description",
          type: "array",
          of: [{ type: "block" }],
        },
        {
          title: "URL",
          name: "url",
          type: "string",
          required: true,
        },
        {
          title: "Image",
          name: "image",
          type: "image",
          required: true,
        },
        {
          title: "Stripe Connect ID",
          name: "stripe_connect_id",
          type: "string",
          required: true,
        },
        {
          title: "Google Sheet",
          name: "google_sheets_id",
          type: "string",
          required: true,
        },
        {
          title: "Write Customer Emails to Google Sheet",
          name: "enable_google_sheets_integration",
          type: "boolean",
        },
      ],
    },
  ],
};

export default Product;
