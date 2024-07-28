import express from "express";
import authRouter from "../apps/auth/auth.router";
import categoryRouter from "../apps/category/category.router";
import productRouter from "../apps/product/product.router";

const indexRouter = express.Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/categories", categoryRouter);
indexRouter.use("/products", productRouter);

export default indexRouter;
