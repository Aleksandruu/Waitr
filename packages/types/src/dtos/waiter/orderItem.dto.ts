import { ProductStatus } from "../../models/productStatus.model";

export interface OrderItemDto {
  productId: string;
  name: string;
  price: number;
  status: ProductStatus;
  orderTime: Date;
  quantity: number;
  id: string;
}
