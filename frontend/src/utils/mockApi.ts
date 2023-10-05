import MockAdapter from "axios-mock-adapter";
import { match, pathToRegexp } from "path-to-regexp";
import axios, { AxiosRequestConfig } from "axios";
import { apiRoutes } from "../routes";
import { categoriesMock } from "../fixtures/categories";
import { getRandomId } from "../fixtures/utils/getRandomId";
import { productsMock } from "../fixtures/products";
import { inventoryMovementsMock } from "../fixtures/inventoryMovements";

const TOKEN = "admin-token";
const REFRESH_TOKEN = "admin-refresh-token";

const AUTH = [
  {
    email: "admin@user.com",
    token: TOKEN,
    refreshToken: REFRESH_TOKEN,
  },
];

const getUser = (config: AxiosRequestConfig) =>
  AUTH.find((item) => item.token === config.headers.token);

const clone = (data: any) => JSON.parse(JSON.stringify(data));
const exclude = [/assets\//];

axios.interceptors.response.use((response) => {
  if (!exclude.find((pattern) => pattern.test(response?.config?.url!))) {
    // eslint-disable-next-line no-console
    console.groupCollapsed(
      `<= ${response?.config?.method?.toUpperCase()} ${response.config.url}`
    );
    // eslint-disable-next-line no-console
    console.dir(clone(response));
    // eslint-disable-next-line no-console
    console.groupEnd();
  }

  return response;
});

export const initializeMockAdapter = () => {
  const mock = new MockAdapter(axios, { delayResponse: 1000 });

  mock
    .onPost(apiRoutes.getTokenByPassword)
    .reply((config: AxiosRequestConfig) => {
      const body = JSON.parse(config.data);
      const auth = AUTH.find((item) => item.email === body.email);
      if (auth) {
        return [201, { token: auth.token, refreshToken: auth.refreshToken }];
      }

      return [401, { error: "Invalid credential." }];
    });

  mock
    .onPost(apiRoutes.getTokenByRefresh)
    .reply((config: AxiosRequestConfig) => {
      const body = JSON.parse(config.data);
      const auth = AUTH.find((item) => item.refreshToken === body.access_token);
      if (auth) {
        return [201, { token: auth.token, refreshToken: auth.refreshToken }];
      }

      return [401, { error: "Invalid credential." }];
    });

  mock.onGet(apiRoutes.getProfile).reply((config) => {
    const user = getUser(config);

    if (!user) {
      return [401];
    }

    return [
      200,
      {
        user,
      },
    ];
  });

  mock.onGet(apiRoutes.getCategories).reply((config) => {
    return [200, categoriesMock];
  });

  mock.onPost(apiRoutes.postCategories).reply((config) => {
    const body = JSON.parse(config.data);
    const newCategory = {
      id: getRandomId(),
      name: body.name,
      created_at: new Date().toISOString(),
    };
    categoriesMock.push(newCategory);

    return [201, newCategory];
  });

  mock.onGet(apiRoutes.getProducts).reply((config) => {
    const MAX_REGISTERS_BY_PAGE = 15;

    const { page = 1 } = config.params;

    const start = page * MAX_REGISTERS_BY_PAGE - MAX_REGISTERS_BY_PAGE;
    const end = Math.min(productsMock.length, start + MAX_REGISTERS_BY_PAGE);

    return [
      200,
      productsMock.slice(start, end).map((item) => ({
        ...item,
        category_name:
          categoriesMock.find((category) => category.id === item.category_id)
            ?.name || "Not found",
      })),
    ];
  });

  mock.onPost(apiRoutes.postProducts).reply((config) => {
    const body = JSON.parse(config.data);
    const newProduct = {
      id: getRandomId(),
      name: body.name,
      category_id: body.category_id,
      quantity: 0,
      created_at: new Date().toISOString(),
    };
    productsMock.push(newProduct);

    return [201, newProduct];
  });

  mock.onGet(pathToRegexp(apiRoutes.getProductById)).reply((config) => {
    const result = match<{ id: string }>(apiRoutes.getProductById, {
      decode: decodeURIComponent,
    })(config.url!);

    if (result === false) {
      return [403];
    }

    const { id } = result.params;

    return [200, productsMock.find((item) => item.id === id)];
  });

  mock.onPost(pathToRegexp(apiRoutes.postInventory)).reply((config) => {
    const result = match<{ id: string }>(apiRoutes.postInventory, {
      decode: decodeURIComponent,
    })(config.url!);

    if (result === false) {
      return [403];
    }

    const { type } = result.params as unknown as { type: "sub" | "add" };

    const body = JSON.parse(config.data);

    const productToChangeQuantity = productsMock.find(
      (item) => item.id === body.id
    );

    if (!productToChangeQuantity) {
      return [422, "Product not found."];
    }

    const newQuantity =
      type === "add"
        ? productToChangeQuantity.quantity + body.quantity
        : productToChangeQuantity.quantity - body.quantity;

    if (newQuantity < 0) {
      return [422, "Insufficient stock."];
    }

    const newInventoryMovement = {
      id: getRandomId(),
      product_id: body.id,
      quantity: body.quantity,
      type,
      created_at: new Date().toISOString(),
    };

    inventoryMovementsMock.push(newInventoryMovement);

    productsMock.forEach((item) => {
      if (item.id === body.id) {
        item.quantity = newQuantity;
      }
    });

    return [201, productsMock.find((item) => item.id === body.id)];
  });
};
