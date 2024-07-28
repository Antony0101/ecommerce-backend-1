import Joi from "joi";
import { paginationValidationSchema } from "../../lib/joiSchema/pagination.validation";

export const categoryQueryValidationSchema = Joi.object({
    ...paginationValidationSchema,
    search: Joi.string().allow("").optional(),
});

export const createCategoryValidation = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
});

export const updateCategoryValidation = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
});
