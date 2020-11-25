import createSchema from "part:@sanity/base/schema-creator";
import schemaTypes from "all:part:@sanity/base/schema-type";

import Bundle from "./bundle";
import Product from "./product";

export default createSchema({
  name: "default",
  types: schemaTypes.concat([Bundle, Product])
});
