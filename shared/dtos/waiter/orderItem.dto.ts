import { ProductStatus } from "@shared/models/productStatus.model";

export interface OrderItemDto {
  productId: string;
  name: string;
  price: number;
  status: ProductStatus;
  orderTime: Date;
  quantity: number;
}
