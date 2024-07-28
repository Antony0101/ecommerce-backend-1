import express from "express";
import JoiQueryValidator from "../../lib/middleware/joiQueryValidator";
import auth, { authOptional } from "../../lib/middleware/auth";
import expressWrapper from "../../lib/wrappers/expressWrapper";
import {
    categoryQueryValidationSchema,
    createCategoryValidation,
    updateCategoryValidation,
} from "./category.validation";
import {
    createCategoryController,
    getCategoriesController,
    editCategoryController,
    getCategoryByIdController,
    deleteCategoryController,
} from "./category.controller";
import JoiValidator from "../../lib/middleware/joiValidator";

const categoryRouter = express.Router();

categoryRouter.get(
    "/",
    JoiQueryValidator(categoryQueryValidationSchema),
    authOptional(),
    expressWrapper(getCategoriesController),
);

categoryRouter.post(
    "/",
    JoiValidator(createCategoryValidation),
    auth("admin"),
    expressWrapper(createCategoryController),
);

categoryRouter.get(
    "/:id",
    authOptional(),
    expressWrapper(getCategoryByIdController),
);

categoryRouter.put(
    "/:id",
    JoiValidator(updateCategoryValidation),
    auth("admin"),
    expressWrapper(editCategoryController),
);

categoryRouter.delete(
    "/:id",
    auth("admin"),
    expressWrapper(deleteCategoryController),
);

export default categoryRouter;
