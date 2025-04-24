import { ProductResponse } from "./product.response.model";

export interface ProductsResponse {
  categoryId: string;
  categoryName: string;
  products: ProductResponse[];
}
