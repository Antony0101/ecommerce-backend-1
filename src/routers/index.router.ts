import express from "express";
import authRouter from "../apps/auth/auth.router";
import categoryRouter from "../apps/category/category.router";

const indexRouter = express.Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/categories", categoryRouter);

export default indexRouter;
