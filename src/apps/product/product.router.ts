import express from "express";
import JoiQueryValidator from "../../lib/middleware/joiQueryValidator";
import auth, { authOptional } from "../../lib/middleware/auth";
import expressWrapper from "../../lib/wrappers/expressWrapper";
import {
    productQueryValidationSchema,
    createProductValidation,
    updateProductValidation,
} from "./product.validation";
import {
    getProductsController,
    getProductByIdController,
    createProductController,
    editProductController,
    deleteProductController,
} from "./product.controller";
import JoiValidator from "../../lib/middleware/joiValidator";

const productRouter = express.Router();

productRouter.get(
    "/",
    JoiQueryValidator(productQueryValidationSchema),
    authOptional(),
    expressWrapper(getProductsController),
);

productRouter.post(
    "/",
    JoiValidator(createProductValidation),
    auth("admin"),
    expressWrapper(createProductController),
);

productRouter.get(
    "/:id",
    authOptional(),
    expressWrapper(getProductByIdController),
);

productRouter.put(
    "/:id",
    JoiValidator(updateProductValidation),
    auth("admin"),
    expressWrapper(editProductController),
);

productRouter.delete(
    "/:id",
    auth("admin"),
    expressWrapper(deleteProductController),
);

export default productRouter;
