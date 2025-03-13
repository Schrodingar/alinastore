"use client";

import {formatCurrency} from "@/lib/formatters"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card"
import {Button} from "./ui/button"
import Image from "next/image"
import { addToCart, isInCart, updateCartItemQuantity, getCartItems, removeFromCart } from "@/actions/cart";import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {Minus, Plus, ShoppingCart} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogTitle} from "@/components/ui/Dialog";
import {getProductData} from "@/actions/product";
import Link from "next/link";

type ProductCardProps = {
    id: string
    name: string
    priceInCents: number
    description: string
    imagePaths: string[]
}

export function ProductCard({
                                id,
                                name,
                                priceInCents,
                                description,
                                imagePaths,
                            }: ProductCardProps) {
    const router = useRouter();
    const [inCart, setInCart] = useState(false);
    const [showDialog, setShowDialog] = useState(false); // Добавляем состояние диалога
    const [quantity, setQuantity] = useState(0);

    // Проверяем, есть ли товар в корзине
    useEffect(() => {
        async function checkCartStatus() {
            const cartItems = await getCartItems();
            const item = cartItems.find((item: { productId: string; quantity: number }) => item.productId === id);
            if (item) {
                setInCart(true);
                setQuantity(item.quantity);
            } else {
                setInCart(false);
                setQuantity(0);
            }
        }
        checkCartStatus();
    }, [id]);



    const handleToggleCart = async () => {
        if (inCart) {
            setShowDialog(true);
        } else {
            await addToCart(id);
            setInCart(true);
            setQuantity(1);
        }
    };

    const handleIncrease = async () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        await updateCartItemQuantity(id, newQuantity);
    };

    const handleDecrease = async () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            await updateCartItemQuantity(id, newQuantity);
        } else {
            await removeFromCart(id);
            setInCart(false);
            setQuantity(0);
        }
    };


    return (
        <>
            <Card className="flex overflow-hidden flex-col">
                <div className="relative w-full h-auto aspect-video">
                    <Image src={imagePaths[0]} fill alt={name} className="object-contain" />
                </div>
                <CardHeader>
                    <Link href={`/products/${id}`} className="hover:underline">
                        <CardTitle className="overflow-hidden text-ellipsis line-clamp-2 min-h-[2.5rem]">
                            {name}
                        </CardTitle>
                    </Link>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p
                        className="min-h-[5rem] whitespace-pre-wrap overflow-hidden"
                        style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 4,
                        }}
                    >
                        {description || "\n\n\n\n"}
                    </p>
                </CardContent>

                <CardFooter className="flex justify-between items-center relative">
                    {/* Левая часть - цена */}
                    <span className="text-lg font-semibold">{formatCurrency(priceInCents / 100)}</span>

                    {/* Правая часть - корзина и кнопки управления количеством */}
                    <div className="flex items-center gap-2 relative min-w-[100px] justify-center">
                        <div className="relative flex items-center">
                            {inCart && (
                                <Button size="icon" variant="outline" onClick={handleDecrease} className="absolute left-[-50px]">
                                    <Minus size={16} />
                                </Button>
                            )}
                            <div className="relative">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleToggleCart}
                                    className={inCart ? "text-green-500" : "text-gray-500"}
                                >
                                    <ShoppingCart size={30} />
                                </Button>
                                {inCart && quantity > 0 && (
                                    <span className="absolute top-0 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full transform translate-x-1/2 -translate-y-1/2">
                    {quantity}
                  </span>
                                )}
                            </div>
                            {inCart && (
                                <Button size="icon" variant="outline" onClick={handleIncrease} className="absolute right-[-50px]">
                                    <Plus size={16} />
                                </Button>
                            )}
                        </div>
                    </div>
                </CardFooter>
            </Card>

            {showDialog && (
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogContent>
                        <DialogTitle>Товар уже в корзине</DialogTitle>
                        <p>Этот товар уже добавлен в корзину. Хотите посмотреть корзину?</p>
                        <DialogFooter>
                            <Button onClick={() => router.push("/cart")}>
                                Показать корзину
                            </Button>
                            <Button variant="outline" onClick={() => setShowDialog(false)}>
                                Закрыть
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

export function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden flex flex-col animate-pulse">
            <div className="w-full aspect-video bg-gray-300"/>
            <CardHeader>
                <CardTitle>
                    <div className="w-3/4 h-6 rounded-full bg-gray-300"/>
                </CardTitle>
                <CardDescription>
                    <div className="w-1/2 h-4 rounded-full bg-gray-300"/>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="w-full h-4 rounded-full bg-gray-300"/>
                <div className="w-full h-4 rounded-full bg-gray-300"/>
                <div className="w-3/4 h-4 rounded-full bg-gray-300"/>
            </CardContent>
            <CardFooter>
                <Button className="w-full" disabled size="lg"></Button>
            </CardFooter>
        </Card>
    )
}
