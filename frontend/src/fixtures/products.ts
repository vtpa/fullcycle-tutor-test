import { IProduct } from "../interfaces/product";

export const productsMock = [
  {
    id: "001",
    name: "Product 001",
    quantity: 10,
    category_id: "001",
    created_at: "2023-10-02 14:07:25",
  },
  {
    id: "002",
    name: "Product 002",
    quantity: 12,
    category_id: "001",
    created_at: "2023-10-02 14:07:26",
  },
  {
    id: "003",
    name: "Product 003",
    quantity: 8,
    category_id: "001",
    created_at: "2023-10-02 14:07:27",
  },
  {
    id: "004",
    name: "Product 004",
    quantity: 7,
    category_id: "002",
    created_at: "2023-10-02 14:07:28",
  },
] as IProduct[];
