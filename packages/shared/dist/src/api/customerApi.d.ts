import { CreateOrderDto, CreateBillDto } from "../types";
export interface OrderType {
    order: CreateOrderDto;
    locationSlug: string;
    tableNumber: number;
}
export interface CallWaiterType {
    locationSlug: string;
    tableNumber: number;
}
export interface BillRequestType {
    bill: CreateBillDto;
    locationSlug: string;
    tableNumber: number;
}
export declare const createCustomerApi: (api: any) => any;
//# sourceMappingURL=customerApi.d.ts.map