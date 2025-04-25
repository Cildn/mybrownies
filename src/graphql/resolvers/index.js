import { productResolvers } from './product.resolver.js';
import { collectionResolvers } from './collection.resolver.js';
import { categoryResolvers } from './category.resolver.js';
import { cartResolvers } from './cart.resolver.js';
import { orderResolvers } from './order.resolver.js';
import { adminResolvers } from './admin.resolver.js';
import {analyticsResolvers} from './analytics.resolver.js';
import { searchResolvers } from './searchResolver.js';

export default {
  Query: {
    ...productResolvers.Query,
    ...collectionResolvers.Query,
    ...categoryResolvers.Query,
    ...cartResolvers.Query,
    ...orderResolvers.Query,
    ...adminResolvers.Query,
    ...analyticsResolvers.Query,
    ...searchResolvers.Query,
  },
  Mutation: {
    ...productResolvers.Mutation,
    ...collectionResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...cartResolvers.Mutation,
    ...orderResolvers.Mutation,
    ...adminResolvers.Mutation,
    ...analyticsResolvers.Mutation,
  },
};