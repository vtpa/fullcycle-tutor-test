export interface IInventoryMovement {
  id: string;
  product_id: string;
  quantity: number;
  type: "add" | "sub";
  created_at: string;
}
