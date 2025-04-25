// This is an example seed file for your Prisma schema.
// It contains a set of sample data to populate your database.
// You can add, modify, or remove data as needed.

const products = [
    {
      id: "prod_01",
      name: "Product A",
      description: "This is product A",
      typeId: "type_01",
      price: 19.99,
      brand: "Brand X",
      stock: 100,
      categoryId: "cat_01",
      images: ["url_to_image_1"],
      videos: ["url_to_video_1"],
      materials: ["material_1"],
      sizes: ["size_1"],
      colors: ["color_1"],
      isFeatured: true,
    },
    {
      id: "prod_02",
      name: "Product B",
      description: "This is product B",
      typeId: "type_02",
      price: 29.99,
      brand: "Brand Y",
      stock: 50,
      categoryId: "cat_02",
      images: ["url_to_image_2"],
      videos: ["url_to_video_2"],
      materials: ["material_2"],
      sizes: ["size_2"],
      colors: ["color_2"],
      isFeatured: false,
    },
    // Add more products as needed
  ];
  
  const productTypes = [
    {
      id: "type_01",
      name: "Type A",
      percentageRate: 10.0,
    },
    {
      id: "type_02",
      name: "Type B",
      percentageRate: 20.0,
    },
    // Add more product types as needed
  ];
  
  const categories = [
    {
      id: "cat_01",
      name: "Category A",
      image: "url_to_category_image_1",
      video: "url_to_category_video_1",
    },
    {
      id: "cat_02",
      name: "Category B",
      image: "url_to_category_image_2",
      video: "url_to_category_video_2",
    },
    // Add more categories as needed
  ];
  
  const collections = [
    {
      id: "coll_01",
      name: "Collection A",
      description: "This is collection A",
      images: ["url_to_collection_image_1"],
      videos: ["url_to_collection_video_1"],
      price: 49.99,
      categoryId: "cat_01",
      status: "active",
    },
    {
      id: "coll_02",
      name: "Collection B",
      description: "This is collection B",
      images: ["url_to_collection_image_2"],
      videos: ["url_to_collection_video_2"],
      price: 69.99,
      categoryId: "cat_02",
      status: "inactive",
    },
    // Add more collections as needed
  ];
  
  const admins = [
    {
      id: "admin_01",
      email: "admin@example.com",
      password: "password123", // In a real application, this should be hashed
      role: "ADMIN",
    },
    // Add more admins as needed
  ];
  
  const siteConfigs = [
    {
      id: "config_01",
      maintenanceMode: false,
      liveMode: true,
      disabledPages: [],
      heroVideo: "url_to_hero_video",
      categoryImages: ["url_to_category_image"],
      featuredProducts: ["prod_01"],
      monthlyTarget: 10000.0,
    },
    // Add more site configurations as needed
  ];
  
  const media = [
    {
      id: "media_01",
      name: "Media File A",
      url: "url_to_media_file_a",
      type: "image",
      size: 1024,
      folder: "/images",
      uploadedAt: new Date(),
    },
    // Add more media files as needed
  ];
  
  // Seed the database
  const seed = async (prisma) => {
    await prisma.productType.createMany({
      data: productTypes,
    });
  
    await prisma.category.createMany({
      data: categories,
    });
  
    await prisma.collection.createMany({
      data: collections,
    });
  
    await prisma.product.createMany({
      data: products,
    });
  
    await prisma.admin.createMany({
      data: admins,
    });
  
    await prisma.siteConfig.createMany({
      data: siteConfigs,
    });
  
    await prisma.media.createMany({
      data: media,
    });
  };
  
  module.exports = {
    seed,
  };