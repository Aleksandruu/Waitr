export interface CreateProductDto {
    name: string;
    ingredients: string;
    nutrients: string;
    allergens: string;
    price: number;
    categoryId: string;
    initialStatus: "cook" | "barman" | "barista" | "ready";
    photo?: File;
}
