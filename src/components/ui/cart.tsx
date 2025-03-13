import * as React from "react";
import { cn } from "@/lib/utils";

const CartItem = React.forwardRef<
  HTMLDivElement,
  { price: number; quantity: number; onIncrease: () => void; onDecrease: () => void; className?: string }
>(({ price, quantity, onIncrease, onDecrease, className }, ref) => {
  const totalPrice = price * quantity;
  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-between p-4 border-b", className)}
    >
      <div className="flex items-center space-x-4">
        <div className="text-lg">Price: ${price}</div>
        <div className="flex items-center space-x-2">
          <button onClick={onDecrease} className="bg-gray-200 p-2 rounded">
            -
          </button>
          <span>{quantity}</span>
          <button onClick={onIncrease} className="bg-gray-200 p-2 rounded">
            +
          </button>
        </div>
      </div>
      <div className="text-lg font-semibold">Total: ${totalPrice}</div>
    </div>
  );
});
CartItem.displayName = "CartItem";

const Cart = React.forwardRef<HTMLDivElement, { items: Array<{ price: number; quantity: number }>; onQuantityChange: (index: number, quantity: number) => void }>(
  ({ items, onQuantityChange }, ref) => {
    const handleIncrease = (index: number) => {
      const newQuantity = items[index].quantity + 1;
      onQuantityChange(index, newQuantity);
    };

    const handleDecrease = (index: number) => {
      const newQuantity = Math.max(0, items[index].quantity - 1);
      onQuantityChange(index, newQuantity);
    };

    const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
      <div ref={ref} className="space-y-4 p-6">
        {items.map((item, index) => (
          <CartItem
            key={index}
            price={item.price}
            quantity={item.quantity}
            onIncrease={() => handleIncrease(index)}
            onDecrease={() => handleDecrease(index)}
          />
        ))}
        <div className="text-2xl font-semibold mt-6">Total: ${totalAmount}</div>
      </div>
    );
  }
);

Cart.displayName = "Cart";

export { Cart, CartItem };
