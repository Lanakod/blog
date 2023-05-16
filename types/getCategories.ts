import { Category } from "@prisma/client";

// export type CategoryProduct = Product & { date: Date[] };

export interface GetCategories {
  id: Category["id"];
  name: Category["name"];
  color: Category["color"];
}
