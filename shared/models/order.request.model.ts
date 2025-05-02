export interface OrderRequest {
  table: number;
  locationId: string;
  orderTime: Date;
  products: ProductOrderRequest[];
}

export interface ProductOrderRequest {
  id: string;
  quantity: number;
}
