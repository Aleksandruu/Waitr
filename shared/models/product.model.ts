export interface Product {
  id: string;
  name: string;
  ingredients: string | null;
  nutrients: string | null;
  allergens: string | null;
  price: number;
  category_id: string;
  ready: "cook" | "barman" | "barista" | "ready";
}
