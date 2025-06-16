import { BillResponseDto } from "./billResponse.dto";
import { OrderItemDto } from "./orderItem.dto";
export interface OrderResponseDto {
    table: number;
    products: OrderItemDto[];
    bills: BillResponseDto[];
    waiterCalledAt: Date | null;
}
//# sourceMappingURL=orderResponse.dto.d.ts.map