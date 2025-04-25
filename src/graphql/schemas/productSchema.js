import { gql } from "graphql-tag";

export const productSchema = gql`
  type Product {
    id: ID!
    displayId: String
    name: String!
    description: String
    additionalInfo: String
    type: ProductType
    prices: [Float!]
    discountRate: Int
    brand: String
    stock: Int!
    category: Category!
    collections: [Collection!]
    images: [String!]!
    videos: [String!]
    materials: [String!]
    sizes: [String!]
    colors: [String!]
    isFeatured: Boolean!
    orderItems: [OrderItem!]
    cartItems: [CartItem!]
  }

  type ProductType {
    id: ID!
    name: String!
    percentageRate: Float!
    products: [Product!]
  }

  type Category {
    id: ID!
    name: String!
    products: [Product!]
  }

  type Collection {
    id: ID!
    name: String!
    products: [Product!]
  }

  type OrderItem {
    id: ID!
    product: Product!
  }

  type CartItem {
    id: ID!
    product: Product!
  }

  extend type Query {
    products: [Product!]!
    productsCount: Int!
    product(id: ID!): Product
    productTypes: [ProductType!]!
    categories: [Category!]!
  }

  input UpdateProductInput {
  name: String
  description: String
  additionalInfo: String
  discountRate: Int
  typeId: ID
  prices: [Float!]
  brand: String
  stock: Int
  categoryId: ID
  images: [String!]
  videos: [String!]
  materials: [String!]
  sizes: [String!]
  colors: [String!]
  isFeatured: Boolean
}

  extend type Mutation {
    createProduct(
      name: String!
      description: String
      additionalInfo: String
      discountRate: Int
      typeId: ID
      prices: [Float!]!
      brand: String
      stock: Int!
      categoryId: ID!
      images: [String!]!
      videos: [String!]
      materials: [String!]
      sizes: [String!]
      colors: [String!]
      isFeatured: Boolean!
    ): Product!

    updateProduct(id: ID!, input: UpdateProductInput!): Product!

    deleteProduct(id: ID!): Product!

    createProductType(name: String!, percentageRate: Float!): ProductType!
    updateProductType(id: ID!, name: String, percentageRate: Float): ProductType!
    deleteProductType(id: ID!): Boolean!
  }
`;