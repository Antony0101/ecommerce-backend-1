import Joi from "joi";
import { paginationValidationSchema } from "../../lib/joiSchema/pagination.validation";

export const getCartQueryValidationSchema = Joi.object({
    ...paginationValidationSchema,
});

export const addProductCartSchema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().required(),
});

export const removeProductCartSchema = Joi.object({
    productId: Joi.string().required(),
});
