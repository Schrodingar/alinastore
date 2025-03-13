import {CATEGORY_ATTRIBUTES} from "@/app/constants/categoryAttributes";

const categories = {
    SKIN_CARE: {
        translations: {uk: "Косметика по догляду", en: "Skincare"},
        subcategories: {
            FACE_CARE: {
                translations: {uk: "Догляд за обличчям", en: "Face care"},
                subcategories: {
                    FACE_MASKS: {
                        translations: {uk: "Маски для шкіри обличчя", en: "Face masks"},
                        attributes: [CATEGORY_ATTRIBUTES.SKIN_TYPE, CATEGORY_ATTRIBUTES.EFFECT]
                    },
                    FACE_CREAMS: {
                        translations: {uk: "Крем для обличчя", en: "Face creams"},
                        attributes: [CATEGORY_ATTRIBUTES.SKIN_TYPE]
                    },
                    ANTI_AGE_CARE: {
                        translations: {
                            uk: "Антивіковий та лікувальний догляд за шкірою",
                            en: "Anti-aging and therapeutic skincare"
                        },
                        attributes: [CATEGORY_ATTRIBUTES.SKIN_TYPE]
                    },
                    CLEANSING_PRODUCTS: {
                        translations: {uk: "Засоби для вмивання та очищення обличчя", en: "Cleansing products"}
                    },
                    EYE_CARE: {
                        translations: {uk: "Засоби по догляду за шкірою навколо очей", en: "Eye care"}
                    },
                    TONERS: {
                        translations: {uk: "Тонізуючі засоби для обличчя", en: "Toners"}
                    },
                    COSMETIC_KITS: {
                        translations: {uk: "Набори косметики по догляду", en: "Skincare sets"}
                    },
                    PEELING: {
                        translations: {uk: "Засоби для пілінгу обличчя", en: "Peeling products"}
                    },
                    SERUMS: {
                        translations: {uk: "Сироватки для обличчя", en: "Serums"}
                    },
                    MAKEUP_REMOVERS: {
                        translations: {uk: "Засоби для демакіяжу", en: "Makeup removers"}
                    },
                    LOTIONS_BALMS: {
                        translations: {uk: "Лосьйони і бальзами для обличчя", en: "Lotions and balms"}
                    },
                    SPRAYS: {
                        translations: {uk: "Спреї для шкіри обличчя і тіла", en: "Face and body sprays"}
                    },
                    CLAY: {
                        translations: {uk: "Косметична глина", en: "Cosmetic clay"}
                    },
                    FACE_SAUNAS: {
                        translations: {uk: "Сауни для обличчя", en: "Facial saunas"}
                    },
                    PATCHES: {
                        translations: {uk: "Патчі для обличчя", en: "Face patches"}
                    }
                }
            }
        }
    },
    HAIR_CARE: {
        translations: {uk: "Догляд за волоссям", en: "Hair care"},
        subcategories: {
            BALMS_CONDITIONERS: {
                translations: {uk: "Бальзами і кондиціонери для волосся", en: "Balms and conditioners"}
            },
            HAIR_MASKS: {
                translations: {uk: "Маски для волосся", en: "Hair masks"}
            },
            HAIR_TREATMENT: {
                translations: {uk: "Засоби для лікування волосся і шкіри голови", en: "Hair and scalp treatment"}
            },
            HAIR_SUN_PROTECTION: {
                translations: {uk: "Сонцезахисні засоби для волосся", en: "Hair sun protection"},
                attributes: []
            }
        }
    },
    BODY_CARE: {
        translations: {uk: "Догляд за тілом", en: "Body care"},
        subcategories: {
            BODY_CREAMS_LOTIONS: {
                translations: {uk: "Креми і лосьйони для тіла", en: "Body creams and lotions"}
            },
            HAND_CARE: {
                translations: {uk: "Засоби по догляду за шкірою рук", en: "Hand care"}
            },
            SHOWER_PRODUCTS: {
                translations: {uk: "Засоби для душа", en: "Shower products"}
            },
            BODY_SPRAYS: {
                translations: {uk: "Спреї для шкіри обличчя і тіла", en: "Body and face sprays"}
            }
        }
    },
    ESSENTIAL_OILS: {
        translations: {uk: "Косметичні та ефірні масла", en: "Cosmetic and essential oils"},
        subcategories: {
            ESSENTIAL_OILS: {
                translations: {uk: "Ефірні масла", en: "Essential oils"}
            },
            COSMETIC_OILS: {
                translations: {uk: "Косметичні масла", en: "Cosmetic oils"}
            }
        }
    },
    SUN_CARE: {
        translations: {uk: "Засоби для засмаги", en: "Sun care"},
        subcategories: {
            SUN_PROTECTION: {
                translations: {uk: "Сонцезахисні засоби для шкіри", en: "Sun protection for skin"},
                attributes: [CATEGORY_ATTRIBUTES.SKIN_TYPE]
            },
            SELF_TANNERS: {
                translations: {uk: "Засоби для автозасмаги", en: "Self-tanners"},
                attributes: [CATEGORY_ATTRIBUTES.EFFECT]
            }
        }
    }
};

/**
 * Функция-обёртка для создания `Proxy`, который поддерживает точечный доступ.
 */
function createCategoryProxy(obj: any): any {
    return new Proxy(obj, {
        get(target, prop) {
            if (prop in target) {
                return typeof target[prop] === "object" && target[prop] !== null
                    ? createCategoryProxy(target[prop])
                    : target[prop];
            }
            return undefined;
        }
    });
}

/**
 * Создаём `CATEGORY_ENUM` с поддержкой `SKIN_CARE.FACE_CARE.FACE_MASKS`
 */
export const CATEGORY_ENUM = createCategoryProxy(categories);
