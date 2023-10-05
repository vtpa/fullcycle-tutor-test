export const apiRoutes = {
  getProfile: "/api/getProfile",
  getTokenByPassword: "/auth",
  getTokenByRefresh: "/auth/refresh",
  getCategories: "/categories",
  postCategories: "/categories",
  getProducts: "/products",
  postProducts: "/products",
  getProductById: "/products/:id",
  postInventory: "/inventory/:type",
};

export const pageRoutes = {
  auth: "/auth",
  main: "/products",
  categories: "/categories",
};
