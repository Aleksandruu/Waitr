import { FileBuffer } from "@shared/models/fileBuffer.model";

export interface ProductModel {
  id: string;
  name: string;
  photo?: FileBuffer;
  price: number;
  category_id: string;
  ingredients: string;
  nutrients: string;
  allergens?: string;
  initial_status: "cook" | "barman" | "barista" | "ready";
}
