import { SKIN_TYPES, EFFECTS } from "@/app/constants/attributeValues";

export const CATEGORY_ATTRIBUTES = {
    SKIN_TYPE: {
        translations: { uk: "Тип шкіри", en: "Skin type" },
        values: Object.values(SKIN_TYPES)
    },
    EFFECT: {
        translations: { uk: "Ефект", en: "Effect" },
        values: Object.values(EFFECTS)
    }
};
