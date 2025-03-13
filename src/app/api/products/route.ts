import { NextResponse } from "next/server";
import db from "@/db/db";

export async function GET() {
    try {
        const products = await db.product.findMany();
        return NextResponse.json(products);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
