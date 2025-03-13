"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { addToCart, updateCartItemQuantity, removeFromCart, getCartItems } from "@/actions/cart";
import Product from "@/app/models/product"; // ✅ Импортируем класс Product

type ProductPageProps = {
    product: Product; // ✅ Используем класс Product
};

export default function ProductPageClient({ product }: ProductPageProps) {
    const router = useRouter();
    const [inCart, setInCart] = useState(false);
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        async function checkCart() {
            const cartItems = await getCartItems();
            const item = cartItems.find((item: { productId: string; quantity: number }) => item.productId === product.id);
            if (item) {
                setInCart(true);
                setQuantity(item.quantity);
            }
        }
        checkCart();
    }, [product.id]);

    const handleAddToCart = async () => {
        if (!inCart) {
            await addToCart(product.id);
            setInCart(true);
            setQuantity(1);
        }
    };

    const handleIncrease = async () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        await updateCartItemQuantity(product.id, newQuantity);
    };

    const handleDecrease = async () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            await updateCartItemQuantity(product.id, newQuantity);
        } else {
            await removeFromCart(product.id);
            setInCart(false);
            setQuantity(0);
        }
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative w-full h-[400px]">
                    <Image src={product.getFirstImage()} fill alt={product.name} className="object-contain" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="text-gray-600 mb-6">{product.description}</p>
                    <p className="text-2xl font-semibold mb-6">{formatCurrency(product.variations[0]?.priceInCents / 100 || 0)}</p>
                    <div className="flex items-center gap-4">
                        {inCart ? (
                            <>
                                <Button size="icon" variant="outline" onClick={handleDecrease}>
                                    <Minus size={16} />
                                </Button>
                                <span className="text-lg font-semibold">{quantity}</span>
                                <Button size="icon" variant="outline" onClick={handleIncrease}>
                                    <Plus size={16} />
                                </Button>
                            </>
                        ) : (
                            <Button size="lg" onClick={handleAddToCart}>
                                <ShoppingCart className="mr-2" /> Добавить в корзину
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
