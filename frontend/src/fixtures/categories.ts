import { ICategory } from "../interfaces/category";

export const categoriesMock = [
  {
    id: "001",
    name: "Category 001",
    created_at: new Date().toISOString(),
  },
  {
    id: "002",
    name: "Category 002",
    created_at: new Date().toISOString(),
  },
] as ICategory[];
