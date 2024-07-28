import { generateAPIError } from "../../lib/errors/apiError.js";
import { Request, Response } from "express";
import ProductModel from "../../models/product.model.js";
import { escapeRegExp } from "../../utils/extra.utils.js";
import { productFilterQuery, productSortObject } from "./product.service.js";
import { ProductSortEnumType } from "../../utils/enums.utils.js";
import CategoryModel from "../../models/category.model.js";

async function getProductsController(req: Request, res: Response) {
    const {
        page,
        limit,
        search,
        category,
        color,
        priceEnd,
        priceStart,
        rating,
        sort,
    } = req.query as unknown as {
        page: number;
        limit: number;
        search: string;
        category: string;
        color: string;
        priceStart: number;
        priceEnd: number;
        rating: number;
        sort: ProductSortEnumType;
    };
    const query = productFilterQuery({
        search,
        category,
        color,
        priceStart,
        priceEnd,
        rating,
    });
    const sortObject = productSortObject({ sort });
    const totalCount = await ProductModel.countDocuments({
        ...query,
    });
    const products = await ProductModel.find({
        ...query,
    })
        .sort(sortObject)
        .skip((page - 1) * limit)
        .limit(limit);
    return res.status(200).json({
        success: true,
        data: products,
        message: "Products fetched successfully",
        page,
        limit,
        totalCount,
    });
}

async function getProductByIdController(req: Request, res: Response) {
    const { id } = req.params;
    const product = await ProductModel.findOne({
        _id: id,
    });
    if (!product) {
        throw generateAPIError("Product not found", 404);
    }
    return res.status(200).json({
        success: true,
        data: product,
        message: "Product fetched successfully",
    });
}

async function createProductController(req: Request, res: Response) {
    const { name, description, image, price, category, color, countInStock } =
        req.body as {
            name: string;
            description: string;
            image: string;
            price: number;
            color: string;
            category: string;
            countInStock: number;
        };
    const categoryExist = await CategoryModel.findOne({ _id: category });
    if (!categoryExist) {
        throw generateAPIError("Category not found", 404);
    }
    const product = new ProductModel({
        name,
        description,
        image,
        price,
        color,
        category,
        countInStock,
    });
    await product.save();
    return res.status(200).json({
        success: true,
        data: product,
        message: "Product created successfully",
    });
}

async function editProductController(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, image, price, category, color, countInStock } =
        req.body as {
            name: string;
            description: string;
            image: string;
            price: number;
            color: string;
            category: string;
            countInStock: number;
        };
    const categoryExist = await CategoryModel.findOne({ _id: category });
    if (!categoryExist) {
        throw generateAPIError("Category not found", 404);
    }
    const product = await ProductModel.findOne({ _id: id });
    if (!product) {
        throw generateAPIError("Product not found", 404);
    }
    product.name = name;
    product.description = description;
    product.image = image;
    product.price = price;
    product.color = color;
    product.category = categoryExist._id;
    product.countInStock = countInStock;
    await product.save();
    return res.status(200).json({
        success: true,
        data: product,
        message: "Product updated successfully",
    });
}

async function deleteProductController(req: Request, res: Response) {
    const { id } = req.params;
    const product = await ProductModel.findOne({
        _id: id,
    });
    if (!product) {
        throw generateAPIError("Product not found", 404);
    }
    await ProductModel.deleteOne({ _id: id });
    return res.status(200).json({
        success: true,
        data: product,
        message: "Product deleted successfully",
    });
}

export {
    getProductsController,
    getProductByIdController,
    createProductController,
    editProductController,
    deleteProductController,
};
