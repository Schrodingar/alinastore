import ProductCategory from "@/app/models/productCategory";
import ProductVariation from "@/app/models/productVariation";

class Product {
    id: string;
    name: string;
    category: ProductCategory;
    description: string;
    variations: ProductVariation[];

    constructor(
        id: string,
        name: string,
        category: ProductCategory,
        description: string,
        variations: ProductVariation[]
    ) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.variations = variations;
    }

    getFirstImage(): string {
        return this.variations[0].imagePaths.length > 0 ? this.variations[0].imagePaths[0] : "https://cdn-icons-png.flaticon.com/512/18233/18233962.png";
    }
}

export default Product;
