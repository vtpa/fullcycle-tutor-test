import { useFetch, usePost } from "../utils/reactQuery";
import { IProduct } from "../interfaces/product";
import { pathToUrl } from "../utils/router";
import { apiRoutes } from "../routes";

interface IProductWithCategory extends IProduct {
  category_name: string;
}

export const useGetProducts = (page: number | null) =>
  useFetch<IProductWithCategory[]>(
    apiRoutes.getProducts,
    { page },
    {
      keepPreviousData: true,
    }
  );

export const useGetProductById = (id: string) =>
  useFetch<IProduct[]>(pathToUrl(apiRoutes.getProducts, { id }));

export const useAddProduct = (
  updater: (
    oldData: IProductWithCategory[],
    newData: IProductWithCategory
  ) => IProductWithCategory[]
) =>
  usePost<IProductWithCategory[], IProductWithCategory>(
    pathToUrl(apiRoutes.postProducts),
    undefined,
    updater
  );
