"use client";

import db from "@/db/db";


// Функция для добавления товара в корзину
export async function addToCart(productId: string, quantity: number = 1) {
  console.log("addToCart")
    if (typeof window === "undefined") {
      // This check ensures we're not running on the server side
      return;
    }
  
    // Получаем корзину из LocalStorage, если она существует
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
    // Ищем товар в корзине
    const existingCartItem = cart.find((item: { productId: string }) => item.productId === productId);
  
    if (existingCartItem) {
      // Обновляем количество, если товар уже в корзине
      existingCartItem.quantity += quantity;
    } else {
      // Если товара нет в корзине, добавляем новый товар
      cart.push({ productId, quantity });
    }
  
    // Сохраняем обновленную корзину в LocalStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log("Add to cart:")
    console.log(cart)
  }


// Функция для проверки, есть ли товар в корзине
export async function isInCart(productId: string) {
    if (typeof window === "undefined") {
        return false;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.some((item: { productId: string }) => item.productId === productId);
}

// Функция для удаления товара из корзины
export async function removeFromCart(productId: string) {
  console.log("removeFromCart")
    // Получаем корзину из LocalStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
    // Удаляем товар из корзины
    const updatedCart = cart.filter((item: { productId: string }) => item.productId !== productId);
  
    // Сохраняем обновленную корзину в LocalStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }

  
// Функция для удаления товара из корзины
export async function decreaseCartItemQuantity(productId: string, quantity: number = 1) {
    if (typeof window === "undefined") {
      // This check ensures we're not running on the server side
      return;
    }
  
    // Получаем корзину из LocalStorage, если она существует
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
    // Ищем товар в корзине
    const existingCartItem = cart.find((item: { productId: string }) => item.productId === productId);
  
    if (existingCartItem.quantity > 0) {
      // Обновляем количество, если товар уже в корзине
      existingCartItem.quantity -= quantity;
    }
  
    // Сохраняем обновленную корзину в LocalStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log("Add to cart:")
    console.log(cart)
  }

// Функция для обновления количества товара в корзине
export async function updateCartItemQuantity(productId: string, newQuantity: number) {
  console.log("updateCartItemQuantity")
    // Получаем корзину из LocalStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
    // Ищем товар в корзине
    const existingCartItem = cart.find((item: { productId: string }) => item.productId === productId);
  
    if (existingCartItem) {
      // Обновляем количество товара
      existingCartItem.quantity = newQuantity;
  
      // Сохраняем обновленную корзину в LocalStorage
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  export async function getCartItems() {
    console.log("getCartItems")
    // Получаем корзину из LocalStorage, если она существует
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
    // Возвращаем все товары в корзине
    return cart;
  }