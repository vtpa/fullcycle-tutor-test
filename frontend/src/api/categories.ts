import { useFetch, usePost } from "../utils/reactQuery";
import { ICategory } from "../interfaces/category";
import { pathToUrl } from "../utils/router";
import { apiRoutes } from "../routes";

export const useGetCategories = () =>
  useFetch<ICategory[]>(apiRoutes.getCategories);

export const useAddCategory = (
  updater: (oldData: ICategory[], newData: ICategory) => ICategory[]
) =>
  usePost<ICategory[], ICategory>(
    pathToUrl(apiRoutes.postCategories),
    undefined,
    updater
  );
