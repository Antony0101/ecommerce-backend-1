import { generateAPIError } from "../../lib/errors/apiError.js";
import { Request, Response } from "express";
import { v4 as uuidV4 } from "uuid";
import { getAuthData } from "../../utils/auth.helper.js";
import UserModel from "../../models/user.model.js";
import CategoryModel from "../../models/category.model.js";
import { escapeRegExp } from "../../utils/extra.utils.js";

async function getCategoriesControllers(req: Request, res: Response) {
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

export { getCategoriesControllers };
