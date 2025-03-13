import { CATEGORY_ENUM } from "@/app/constants/categories";

class ProductCategory {
    id: string;
    name: string;
    subcategories: Record<string, ProductCategory>;


    constructor(id: string,  name: string, subcategories: Record<string, ProductCategory> = {}) {
        this.id = id;
        this.name = name;
        this.subcategories = subcategories;
    }

    // Рекурсивно создаём объект из дерева `CATEGORY_ENUM`
    static fromObject(obj: any): ProductCategory {
        return new ProductCategory(
            obj.id || "", // явно передаём id
            obj.name || "", // явно передаём name
            obj.subcategories
                ? Object.fromEntries(
                    Object.entries(obj.subcategories).map(([key, sub]) => [key, ProductCategory.fromObject(sub)])
                )
                : {}
        );
    }


    // Поиск категории по пути, используя точечный доступ
    static findCategoryByPath(path: string): ProductCategory | null {
        const keys = path.split(".");
        let node: any = CATEGORY_ENUM;

        for (const key of keys) {
            if (node[key]) {
                node = node[key];
            } else {
                return null;
            }
        }

        return ProductCategory.fromObject(node);
    }

    // Поиск полного пути категории
    static findCategoryPath(categoryName: string, node: any = CATEGORY_ENUM, path: string[] = []): string[] | null {
        if (node.name === categoryName) return [...path, node.name];

        if (node.subcategories) {
            for (const key in node.subcategories) {
                const foundPath = ProductCategory.findCategoryPath(categoryName, node.subcategories[key], [...path, node.name]);
                if (foundPath) return foundPath;
            }
        }

        return null;
    }
}

export default ProductCategory;
