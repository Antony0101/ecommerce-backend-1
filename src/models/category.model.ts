import mongoose from "mongoose";
import { ExtractDocument, ExtractEntity } from "../utils/mongoHelper.utils.js";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const CategoryModel = mongoose.model("categories", categorySchema);

export type CategoryEntity = ExtractEntity<typeof CategoryModel>;
export type CategoryDocument = ExtractDocument<typeof CategoryModel>;

export default CategoryModel;
