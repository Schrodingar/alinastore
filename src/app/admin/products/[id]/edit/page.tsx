import { notFound } from "next/navigation";
import { getProductData } from "@/actions/product";
import {ProductForm} from "@/app/admin/products/_components/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
    if (!params?.id) {
        return notFound(); // Если id нет, возвращаем 404
    }

    const product = await getProductData(params.id); // Загружаем данные товара
    if (!product) {
        return notFound();
    }

    return (
        <div>
            <h1>Edit Product</h1>
            <ProductForm product={product} />
        </div>
    );
}
