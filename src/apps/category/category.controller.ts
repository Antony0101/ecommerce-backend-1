import { generateAPIError } from "../../lib/errors/apiError.js";
import { Request, Response } from "express";
import CategoryModel from "../../models/category.model.js";
import { escapeRegExp } from "../../utils/extra.utils.js";
import ProductModel from "../../models/product.model.js";

async function getCategoriesController(req: Request, res: Response) {
    const { page, limit, search } = req.query as unknown as {
        page: number;
        limit: number;
        search: string;
    };
    const searchQuery = search ? escapeRegExp(search) : "";
    const totalCount = await CategoryModel.countDocuments({
        name: { $regex: searchQuery, $options: "i" },
    });
    const categories = await CategoryModel.find({
        name: { $regex: searchQuery, $options: "i" },
    })
        .skip((page - 1) * limit)
        .limit(limit);
    return res.status(200).json({
        success: true,
        data: categories,
        message: "Categories fetched successfully",
        page,
        limit,
        totalCount,
    });
}

async function getCategoryByIdController(req: Request, res: Response) {
    const { id } = req.params;
    const category = await CategoryModel.findOne({
        _id: id,
    });
    if (!category) {
        throw generateAPIError("Category not found", 404);
    }
    return res.status(200).json({
        success: true,
        data: category,
        message: "Category fetched successfully",
    });
}

async function createCategoryController(req: Request, res: Response) {
    const { name, description, image } = req.body as {
        name: string;
        description: string;
        image: string;
    };
    const category = new CategoryModel({
        name,
        description,
        image,
    });
    await category.save();
    return res.status(200).json({
        success: true,
        data: category,
        message: "Category created successfully",
    });
}

async function editCategoryController(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, image } = req.body as {
        name: string;
        description: string;
        image: string;
    };
    const category = await CategoryModel.findOne({ _id: id });
    if (!category) {
        throw generateAPIError("Category not found", 404);
    }
    category.name = name;
    category.description = description;
    category.image = image;
    await category.save();
    return res.status(200).json({
        success: true,
        data: category,
        message: "Category updated successfully",
    });
}

async function deleteCategoryController(req: Request, res: Response) {
    const { id } = req.params;
    const category = await CategoryModel.findOne({
        _id: id,
    });
    if (!category) {
        throw generateAPIError("Category not found", 404);
    }
    await CategoryModel.deleteOne({ _id: id });
    await ProductModel.deleteMany({ category: id });
    return res.status(200).json({
        success: true,
        data: category,
        message: "Category deleted successfully",
    });
}

export {
    getCategoriesController,
    getCategoryByIdController,
    createCategoryController,
    editCategoryController,
    deleteCategoryController,
};
