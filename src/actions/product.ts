"use server";

import db from "@/db/db";

export async function getProductData(productId: string) {
  try {
    if (!productId) {
      console.error("❌ Product ID is undefined");
      return null;
    }

    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      console.warn(`⚠ Product not found in DB for ID: ${productId}`);
      return null;
    }

    console.log("✅ Product found:", product);
    return product;
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return null;
  }
}
