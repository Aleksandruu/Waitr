import { ManagerProductResponseDto } from "./getProducts.dto";

export interface ManagerProductDetailsDto extends ManagerProductResponseDto {
  id: string;
  name: string;
  ingredients: string;
  nutrients: string;
  allergens: string;
  price: number;
  category_id: string;
  initial_status: "cook" | "barman" | "barista" | "ready";
  photo_url?: string;
}
