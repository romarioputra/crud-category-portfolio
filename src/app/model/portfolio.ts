export interface Portfolio {
    id?: number,
    name_portofolio: string,
    image_portofolio: File,
    category_portofolio: string,
    desc_portofolio: string
}

export interface PortfolioInfo {
    response: {
        data: Portfolio[]
    }
}