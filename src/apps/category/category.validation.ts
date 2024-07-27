import Joi from "joi";
import { paginationValidationSchema } from "../../lib/joiSchema/pagination.validation";

export const categoryQueryValidationSchema = Joi.object({
    ...paginationValidationSchema,
    search: Joi.string().allow("").optional(),
});
