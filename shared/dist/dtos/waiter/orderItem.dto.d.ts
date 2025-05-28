import { ProductStatus } from "shared/src/models/productStatus.model";
export interface OrderItemDto {
    productId: string;
    name: string;
    price: number;
    status: ProductStatus;
    orderTime: Date;
    quantity: number;
}
//# sourceMappingURL=orderItem.dto.d.ts.map