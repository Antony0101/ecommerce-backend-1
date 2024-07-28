import express from "express";
import JoiQueryValidator from "../../lib/middleware/joiQueryValidator";
import auth from "../../lib/middleware/auth";
import expressWrapper from "../../lib/wrappers/expressWrapper";
import {
    getCartQueryValidationSchema,
    addProductCartSchema,
    removeProductCartSchema,
} from "./cart.validation";
import {
    getCartsByUserController,
    getCartByIdController,
    getCurrentCartOfUserController,
    addProductToCartController,
    removeProductFromCartController,
    checkoutCartController,
} from "./cart.controller";
import JoiValidator from "../../lib/middleware/joiValidator";
import expressTWrapper from "../../lib/wrappers/expressTWrapper";

const cartRouter = express.Router();

cartRouter.get(
    "/",
    JoiQueryValidator(getCartQueryValidationSchema),
    auth("user"),
    expressWrapper(getCartsByUserController),
);

cartRouter.get(
    "/current",
    auth("user"),
    expressWrapper(getCurrentCartOfUserController),
);

cartRouter.get("/:id", auth("all"), expressWrapper(getCartByIdController));

cartRouter.post(
    "/",
    JoiValidator(addProductCartSchema),
    auth("user"),
    expressWrapper(addProductToCartController),
);

cartRouter.delete(
    "/",
    JoiValidator(removeProductCartSchema),
    auth("user"),
    expressWrapper(removeProductFromCartController),
);

cartRouter.post(
    "/checkout",
    auth("user"),
    expressTWrapper(checkoutCartController),
);

export default cartRouter;
