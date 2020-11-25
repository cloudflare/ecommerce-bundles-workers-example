const Bundle = {
  title: "Bundle",
  name: "bundle",
  type: "document",
  initialValue: {
    fee: false,
    published: false,
  },
  fields: [
    {
      title: "Name",
      name: "name",
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
      title: "Description",
      name: "description",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      title: "Sale Start",
      name: "sale_start",
      type: "datetime",
      required: true,
    },
    {
      title: "Sale End",
      name: "sale_end",
      type: "datetime",
      required: true,
    },
    {
      title: "Published",
      name: "published",
      type: "boolean",
      required: true,
    },
    {
      title: "Take Fee",
      name: "fee",
      type: "boolean",
      required: true,
    },
    {
      title: "Slug",
      name: "slug",
      type: "string",
      required: true,
    },
    {
      title: "Download URL",
      name: "download_url",
      type: "string",
      required: true,
    },
    {
      title: "Stripe Price ID",
      name: "stripe_price_id",
      type: "string",
      required: true,
    },
    {
      title: "Stripe Product ID",
      name: "stripe_product_id",
      type: "string",
      required: true,
    },
    {
      title: "Price",
      name: "price",
      type: "number",
      required: true,
    },
    {
      title: "Savings",
      name: "savings",
      type: "string",
    },
    {
      title: "Products",
      name: "products",
      type: "array",
      required: true,
      of: [{ type: "reference", to: [{ type: "product" }] }],
    },
    {
      title: "Open Graph Info",
      name: "open_graph",
      type: "object",
      fields: [
        {
          title: "Title",
          name: "title",
          type: "string",
        },
        {
          title: "Description",
          name: "description",
          type: "string",
        },
        {
          title: "Image",
          name: "image",
          type: "image",
        },
      ],
    },
  ],
};

export default Bundle;
