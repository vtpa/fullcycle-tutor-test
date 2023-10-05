import { IInventoryMovement } from "../interfaces/inventoryMovement";

export const inventoryMovementsMock = [
  {
    id: "001",
    product_id: "001",
    quantity: 2,
    type: "add",
    created_at: "2023-10-02 14:08:25",
  },
  {
    id: "002",
    product_id: "001",
    quantity: 1,
    type: "sub",
    created_at: "2023-10-02 14:08:29",
  },
] as IInventoryMovement[];
