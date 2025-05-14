import { OrderItemDto } from "./orderItem.dto";

export interface OrderResponseDto {
  table: number;
  products: OrderItemDto[];
}
