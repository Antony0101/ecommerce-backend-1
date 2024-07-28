import mongoose from "mongoose";
import { ExtractDocument, ExtractEntity } from "../utils/mongoHelper.utils.js";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "categories",
            required: true,
        },
        countInStock: {
            type: Number,
            required: true,
        },
        rating: {
            type: Number,
            default: 0,
            required: true,
        },
        numReviews: {
            type: Number,
            default: 0,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const ProductModel = mongoose.model("products", productSchema);

export type ProductEntity = ExtractEntity<typeof ProductModel>;
export type ProductDocument = ExtractDocument<typeof ProductModel>;

export default ProductModel;
