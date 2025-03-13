"use client";
import { useEffect, useState } from "react";

async function getProducts() {
    try {
        const res = await fetch("/api/products"); // 🔹 API-запрос
        if (!res.ok) throw new Error("Failed to fetch products");
        return await res.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
}

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts().then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (products.length === 0) return <p>No products found</p>;

    return (
        <div>
            {products.map((product) => (
                <p key={product.id}>{product.name}</p>
            ))}
        </div>
    );
}
