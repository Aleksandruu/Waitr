export interface OrderProductDto {
  orderProductId: number;
  quantity: number;
  status: string;
  orderTime: string;
  preferences?: string;
  productName: string;
  tableNumber: number;
}
