"use client";

import React, { useState, useEffect } from "react";
import { getProductData } from "@/actions/product";
import { 
  addToCart, 
  removeFromCart, 
  decreaseCartItemQuantity, 
  updateCartItemQuantity 
} from "@/actions/cart";

const CartPage = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [productsData, setProductsData] = useState<any[]>([]);

  const fetchProductData = async (productId: string) => {
    try {
      const productData = await getProductData(productId);
      if (productData) {
        setProductsData((prevData) => {
          const existingProduct = prevData.find((p) => p.id === productId);
          return existingProduct ? prevData : [...prevData, productData];
        });
      }
    } catch (error) {
      console.error(`Failed to fetch product data for ID: ${productId}`, error);
    }
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
    storedCart.forEach((item: any) => fetchProductData(item.productId));
  }, []);

  const handleQuantityIncrease = (productId: string) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityDecrease = (productId: string) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (productId: string) => {
    const updatedCart = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.max(newQuantity, 1) }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = productsData.find((p) => p.id === item.productId);
      return total + (product ? product.priceInCents * item.quantity : 0);
    }, 0);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Image</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Quantity</th>
              <th className="border border-gray-300 p-2">Subtotal</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => {
              const product = productsData.find((p) => p.id === item.productId);
              const subtotal = product
                ? (product.priceInCents * item.quantity) / 100
                : 0;

              return (
                <tr key={item.productId} className="text-center">
                  <td className="border border-gray-300 p-2">
                    <img
                      src={product?.imagePaths[0]}
                      alt={product?.name || "Placeholder"}
                      className="w-16 h-16 object-cover mx-auto"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">{product?.name || "Unknown"}</td>
                  <td className="border border-gray-300 p-2">
                    ${product ? (product.priceInCents / 100).toFixed(2) : "0.00"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex items-center justify-center">
                      <button
                        className="px-2 py-1 bg-gray-300 rounded-l"
                        onClick={() => handleQuantityDecrease(item.productId)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        min={1}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.productId,
                            parseInt(e.target.value, 10)
                          )
                        }
                        className="w-12 text-center border border-gray-300 mx-1"
                      />
                      <button
                        className="px-2 py-1 bg-gray-300 rounded-r"
                        onClick={() => handleQuantityIncrease(item.productId)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="border border-gray-300 p-2">
                    ${subtotal.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleRemoveItem(item.productId)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <div className="mt-4 text-right font-bold">
        <span>Total: </span>
        <span>${(calculateTotal() / 100).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default CartPage;
