import { ProductResponseDto } from "./productResponse.dto";

export interface CategoryWithProductsDto {
  categoryId: string;
  categoryName: string;
  products: ProductResponseDto[];
}
