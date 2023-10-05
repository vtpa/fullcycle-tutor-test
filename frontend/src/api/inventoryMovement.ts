import { usePost } from "../utils/reactQuery";
import { IProduct } from "../interfaces/product";
import { pathToUrl } from "../utils/router";
import { apiRoutes } from "../routes";

interface IUseAddInventoryMovementParams {
  product_id: string;
  quantity: number;
  type: "sub" | "add";
}

export const useAddInventoryMovement = (
  updater: (oldData: IProduct[], newData: IProduct) => IProduct[],
  { product_id, quantity, type }: IUseAddInventoryMovementParams
) =>
  usePost<IProduct[], IProduct>(pathToUrl(apiRoutes.postInventory, { type }), {
    product_id,
    quantity,
  });
