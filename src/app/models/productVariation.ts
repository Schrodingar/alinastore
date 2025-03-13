class ProductVariation {
    sizeValue: number;
    sizeUnit: string;
    priceInCents: number;
    imagePaths: string[];

    constructor(sizeValue: number, sizeUnit: string, priceInCents: number, imagePaths: string[]) {
        this.sizeValue = sizeValue;
        this.sizeUnit = sizeUnit;
        this.priceInCents = priceInCents;
        this.imagePaths = imagePaths;


    }

    getPrice(): number {
        return Number((this.priceInCents / 100).toFixed(2));

    }


}

export default ProductVariation;
