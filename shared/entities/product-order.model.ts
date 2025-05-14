import { ProductStatus } from "@shared/models/productStatus.model";

export interface ProductOrderModel {
  id: string;
  product_id: string;
  quantity: number;
  order_id: string;
  status: ProductStatus;
  details: string;
  created_at: string;
  preferences: string;
}
