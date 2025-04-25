import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const searchResolvers = {
  Query: {
    search: async (_, { query, categoryId, excludeProductId }) => {
      try {
        console.log(`🔎 Searching for: ${query}`);

        // Search Products using raw SQL, JOIN Category for category id & name
        const productRows = await prisma.$queryRaw`
          SELECT 
            p.id,
            p.name,
            p.description,
            p.prices,
            p.sizes,
            p.colors,
            p.images[1] AS image,
            p."categoryId" AS "categoryId",
            c.name         AS "categoryName"
          FROM "Product" p
          LEFT JOIN "Category" c ON p."categoryId" = c.id
          WHERE
            (${categoryId}::text IS NULL OR p."categoryId" = ${categoryId}::text)
            AND (${excludeProductId}::text IS NULL OR p.id != ${excludeProductId}::text)
            AND to_tsvector('english', p.name || ' ' || p.description) 
                @@ plainto_tsquery('english', ${query}::text)
          ORDER BY
            ts_rank(
              to_tsvector('english', p.name || ' ' || p.description),
              plainto_tsquery('english', ${query}::text)
            ) DESC
          LIMIT 10;
        `;

        // Map raw rows into GraphQL-shape objects
        const products = productRows.map(r => ({
          id:          r.id,
          name:        r.name,
          description: r.description,
          prices:      r.prices,
          sizes:       r.sizes,
          colors:      r.colors,
          image:       r.image,
          category: {
            id:   r.categoryId,
            name: r.categoryName,
          }
        }));

        // Search Collections using raw SQL, JOIN Category for id & name
        const collectionRows = await prisma.$queryRaw`
          SELECT
            col.id,
            col.name,
            col.description,
            col."categoryId"   AS "categoryId",
            c2.name            AS "categoryName"
          FROM "Collection" col
          LEFT JOIN "Category" c2 ON col."categoryId" = c2.id
          WHERE
            to_tsvector('english', col.name || ' ' || col.description)
              @@ plainto_tsquery('english', ${query}::text)
          ORDER BY
            ts_rank(
              to_tsvector('english', col.name || ' ' || col.description),
              plainto_tsquery('english', ${query}::text)
            ) DESC
          LIMIT 10;
        `;

        const collections = collectionRows.map(r => ({
          id:          r.id,
          name:        r.name,
          description: r.description,
          category: {
            id:   r.categoryId,
            name: r.categoryName,
          }
        }));

        console.log("✅ Search complete!");
        return { products, collections };
      } catch (err) {
        console.error("❌ Error in search resolver:", err);
        throw new Error("Search failed: " + err.message);
      }
    },
  },
};
