import { mergeTypeDefs } from '@graphql-tools/merge';
import rootSchema from './rootSchema.js';
import { productSchema } from './productSchema.js';
import { categorySchema } from './categorySchema.js';
import { collectionSchema } from './collectionSchema.js';
import { cartSchema } from './cartSchema.js';
import { orderSchema } from './orderSchema.js';
import { mediaSchema } from './mediaSchema.js';
import { adminSchema } from './adminSchema.js';
import { analyticsSchema } from './analyticsSchema.js';
import { searchSchema } from './searchSchema.js';
import { campaignSchema } from './campaignSchema.js';

const typeDefs = mergeTypeDefs([
  rootSchema,
  productSchema,
  adminSchema,
  collectionSchema,
  categorySchema,
  cartSchema,
  orderSchema,
  mediaSchema,
  analyticsSchema,
  searchSchema,
  campaignSchema,
]);

export default typeDefs;