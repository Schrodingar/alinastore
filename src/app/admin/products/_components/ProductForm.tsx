"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addProduct, updateProduct } from "../../_actions/products";
import Product from "@/app/models/product";
import ProductVariation from "@/app/models/productVariation";
import { CATEGORY_ENUM } from "@/app/constants/categories";

interface FormErrors {
    name?: string;
    description?: string;
    categoryId?: string;
    images?: string;
}

export function ProductForm({ product }: { product?: Product | null }) {
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categoryId, setCategoryId] = useState<string>(product?.category?.id || "");
    const [variations, setVariations] = useState<ProductVariation[]>(product?.variations || []);
    const [existingImages, setExistingImages] = useState<string[]>(product?.imagePaths || []);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [deletedImages, setDeletedImages] = useState<string[]>([]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        formData.set("name", event.currentTarget.name.valueOf());
        formData.set("description", event.currentTarget.description.value);
        formData.set("categoryId", categoryId);

        existingImages.forEach((imagePath) => formData.append("existingImages", imagePath));
        selectedFiles.forEach((file) => formData.append("newImages", file));
        deletedImages.forEach((imagePath) => formData.append("deletedImages", imagePath));

        variations.forEach((variation, index) => {
            formData.append(`variations[${index}][volume]`, variation.sizeValue.toString());
            formData.append(`variations[${index}][priceInCents]`, variation.priceInCents.toString());
        });

        const action = product == null
            ? (formData: FormData) => addProduct(null, formData)
            : (formData: FormData) => updateProduct(product.id, formData);

        const errors = await action(formData);

        if (errors) {
            const fieldErrors = errors as {
                name?: string[];
                description?: string[];
                categoryId?: string[];
                newImages?: string[];
            };

            setFormErrors({
                name: fieldErrors.name?.join(", ") || "",
                description: fieldErrors.description?.join(", ") || "",
                categoryId: fieldErrors.categoryId?.join(", ") || "",
                images: fieldErrors.newImages?.join(", ") || "",
            });
        } else {
            setFormErrors({});
            setSelectedFiles([]);
            setDeletedImages([]);
        }

        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" required defaultValue={product?.name || ""} />
                {formErrors.name && <div className="text-destructive">{formErrors.name}</div>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <select
                    id="categoryId"
                    name="categoryId"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                >
                    <option value="">Select Category</option>
                    {Object.entries(CATEGORY_ENUM).map(([key, category]) => (
                        <option key={key} value={key}>
                            {(category as { name: string }).name}
                        </option>
                    ))}
                </select>
                {formErrors.categoryId && <div className="text-destructive">{formErrors.categoryId}</div>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required defaultValue={product?.description || ""} />
                {formErrors.description && <div className="text-destructive">{formErrors.description}</div>}
            </div>

            <div className="space-y-2">
                <Label>Variations</Label>
                {variations.map((variation, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input
                            type="number"
                            placeholder="Volume (ml)"
                            value={variation.sizeValue}
                            onChange={(e) => {
                                const updated = [...variations];
                                updated[index].sizeValue = Number(e.target.value);
                                setVariations(updated);
                            }}
                        />
                        <Input
                            type="number"
                            placeholder="Price (cents)"
                            value={variation.priceInCents}
                            onChange={(e) => {
                                const updated = [...variations];
                                updated[index].priceInCents = Number(e.target.value);
                                setVariations(updated);
                            }}
                        />
                        <Button
                            type="button"
                            onClick={() => setVariations(variations.filter((_, i) => i !== index))}
                            className="bg-red-500 text-white"
                        >
                            X
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    onClick={() => setVariations([...variations, new ProductVariation(0, "ml", 0)])}
                >
                    + Add Variation
                </Button>
            </div>

            <SubmitButton isSubmitting={isSubmitting} />
        </form>
    );
}

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
    return (
        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
        </Button>
    );
}
