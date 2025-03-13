"use client";

import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Suspense, useEffect, useState } from "react";
import { Product } from "@prisma/client"; // ✅ Импортируем `Product` для типизации

async function getProducts() {
    try {
        const res = await fetch("/api/products"); // Запрос к API
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
}

export default function ProductsPage() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Suspense
                fallback={
                    <>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))}
                    </>
                }
            >
                <Products />
            </Suspense>
        </div>
    );
}

function Products() {
    const [products, setProducts] = useState<Product[]>([]); // ✅ Явно указываем тип `Product[]`
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts().then((data: Product[]) => { // ✅ Явно указываем `data: Product[]`
            setProducts(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <>
                {Array.from({ length: 6 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                ))}
            </>
        );
    }

    if (products.length === 0) {
        return <p className="text-center text-gray-500">No products available.</p>;
    }

    return (
        <>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    {...product} // ✅ Передаем все свойства, включая `imagePaths`
                />
            ))}
        </>
    );
}
