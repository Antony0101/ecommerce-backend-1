import Joi from "joi";
import { paginationValidationSchema } from "../../lib/joiSchema/pagination.validation";
import { PRODUCT_SORT_ENUM } from "../../utils/enums.utils";

export const productQueryValidationSchema = Joi.object({
    ...paginationValidationSchema,
    search: Joi.string().allow("").optional(),
    category: Joi.string().allow("").optional(),
    color: Joi.string().allow("").optional(),
    priceStart: Joi.number().allow("").optional(),
    priceEnd: Joi.number().allow("").optional(),
    rating: Joi.number().allow("").optional(),
    sort: Joi.string()
        .valid(...Object.values(PRODUCT_SORT_ENUM), "")
        .optional(),
});

export const createProductValidation = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    price: Joi.number().required(),
    color: Joi.string().required(),
    category: Joi.string().required(),
    countInStock: Joi.number().required(),
});

export const updateProductValidation = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    price: Joi.number().required(),
    color: Joi.string().required(),
    category: Joi.string().required(),
    countInStock: Joi.number().required(),
});
