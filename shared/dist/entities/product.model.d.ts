export interface ProductModel {
    id: string;
    name: string;
    price: number;
    category_id: string;
    ingredients: string;
    nutrients: string;
    allergens?: string;
    initial_status: "cook" | "barman" | "barista" | "ready";
    photo_url?: string;
}
//# sourceMappingURL=product.model.d.ts.map