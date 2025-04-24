export interface ProductRequest {
  name: string;
  ingredients: string;
  nutrients: string;
  allergens: string;
  price: number;
  category_id: string;
  ready: "cook" | "barman" | "barista" | "ready";
}
