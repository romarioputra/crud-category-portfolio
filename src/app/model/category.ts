export interface Category {
    id?: number,
    name_category: string,
    desc_category: string,
    classification_id: number
}

export interface CategoryInfo {
    response: {
        data: Category[]
    }
}