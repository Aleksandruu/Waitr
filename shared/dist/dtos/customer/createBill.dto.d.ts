import { CartItemDto } from "./productOrderWithNameAndPrice.dto";
export interface CreateBillDto {
    items: CartItemDto[];
    paymentMethod: "cash" | "card";
    tips: number;
}
//# sourceMappingURL=createBill.dto.d.ts.map