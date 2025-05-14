export interface CreateOrderDto {
  orderTime: Date;
  products: ProductQuantityDto[];
}

export interface ProductQuantityDto {
  id: string;
  quantity: number;
  preferences?: string;
}
