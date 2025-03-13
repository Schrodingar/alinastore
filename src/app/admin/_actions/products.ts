"use server";

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import ProductVariation from "@/app/models/productVariation";

const imageSchema = z.instanceof(File).refine(
    (file) => file.size > 0 && file.type.startsWith("image/"),
    "Invalid image file"
);

const variationSchema = z.object({
    volume: z.coerce.number().int().positive(),
    priceInCents: z.coerce.number().int().positive(),
});

const baseSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    categoryId: z.string().min(1),
    variations: z.array(variationSchema).nonempty(),
    newImages: z.array(imageSchema).optional(),
    existingImages: z.array(z.string()).optional(),
    deletedImages: z.array(z.string()).optional(),
});

export async function addProduct(prevState: unknown, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());


    const variations: ProductVariation[] = [];

    formData.forEach((value, key) => {
        const match = key.match(/^variations\[(\d+)]\[(\w+)]$/);
        if (match) {
            const index = Number(match[1]);
            const field = match[2];

            if (!variations[index]) {
                variations[index] = new ProductVariation(0, "", 0, []); // создание экземпляра класса
            }

            if (field === "volume") {
                variations[index].sizeValue = Number(value);
            } else if (field === "priceInCents") {
                variations[index].priceInCents = Number(value);
            }
        }
    });



    const newImages = formData.getAll("newImages") as File[];

    const finalData = { ...rawData, variations, newImages };

    const result = baseSchema.safeParse(finalData);
    if (!result.success) {
        return result.error.formErrors.fieldErrors;
    }

    const data = result.data;

    const imagePaths: string[] = [];
    if (data.newImages) {
        await fs.mkdir("public/products", { recursive: true });
        for (const image of data.newImages) {
            const imagePath = `/products/${crypto.randomUUID()}-${image.name}`;
            await fs.writeFile(
                `public${imagePath}`,
                Buffer.from(await image.arrayBuffer())
            );
            imagePaths.push(imagePath);
        }
    }

    await db.product.create({
        data: {
            name: result.data.name,
            description: result.data.description,
            categoryId: result.data.categoryId,
            imagePaths,
            variations: {
                create: result.data.variations.map(variation => ({
                    volume: variation.volume,
                    priceInCents: variation.priceInCents,
                    size: variation.volume, // ← добавляем обязательное поле 'size'
                })),
            },
        },
    });


    revalidatePath("/");
    revalidatePath("/products");

    redirect("/admin/products");
}

export async function updateProduct(prevState: unknown, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const productId = formData.get("id") as string;

    const variations = [];
    formData.forEach((value, key) => {
        if (key.match(/^variations\[\d+\]\[.*\]$/)) {
            const [, index, field] = key.match(/^variations\[(\d+)\]\[(.*)\]$/)!;
            variations[Number(index)] = variations[Number(index)] || {};
            variations[Number(index)][field] = value;
        }
    });

    const newImages = formData.getAll("newImages") as File[];
    const existingImages = formData.getAll("existingImages") as string[];
    const deletedImages = formData.getAll("deletedImages") as string[];

    const finalData = {
        ...rawData,
        variations,
        newImages,
        existingImages,
        deletedImages,
    };

    const result = baseSchema.safeParse(finalData);

    if (!result.success) {
        return result.error.formErrors;
    }

    const product = await db.product.findUnique({
        where: { id: rawData.id as string },
        include: { variations: true },
    });

    if (!product) return notFound();

    const updatedImagePaths = product.imagePaths.filter(
        (path) => !result.data.deletedImages?.includes(path)
    );

    if (result.data.newImages) {
        await fs.mkdir("public/products", { recursive: true });
        for (const image of result.data.newImages) {
            const imagePath = `/products/${crypto.randomUUID()}-${image.name}`;
            await fs.writeFile(
                `public${imagePath}`,
                Buffer.from(await image.arrayBuffer())
            );
            updatedImagePaths.push(imagePath);
        }
    }

    await db.product.update({
        where: { id: product.id },
        data: {
            name: result.data.name,
            description: result.data.description,
            categoryId: result.data.categoryId,
            imagePaths: updatedImagePaths,
            variations: {
                deleteMany: {},
                create: result.data.variations,
            },
        },
    });

    revalidatePath("/");
    revalidatePath("/products");

    redirect("/admin/products");
}
