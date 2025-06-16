export interface BillItemDto {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface BillResponseDto {
  id: string;
  tableNumber: number;
  paymentMethod: "cash" | "card";
  tips: number;
  totalAmount: number;
  createdAt: Date;
  items: BillItemDto[];
}
