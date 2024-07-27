import express from "express";
import queryModifierMiddleware from "../../lib/middleware/queryModifier";
import JoiQueryValidator from "../../lib/middleware/joiQueryValidator";
import { authOptional } from "../../lib/middleware/auth";
import expressWrapper from "../../lib/wrappers/expressWrapper";
import { categoryQueryValidationSchema } from "./category.validation";
import { getCategoriesControllers } from "./category.controller";

const categoryRouter = express.Router();

categoryRouter.get(
    "/",
    JoiQueryValidator(categoryQueryValidationSchema),
    authOptional(),
    expressWrapper(getCategoriesControllers),
);

export default categoryRouter;
