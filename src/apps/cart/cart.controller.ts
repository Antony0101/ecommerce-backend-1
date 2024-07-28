import { generateAPIError } from "../../lib/errors/apiError.js";
import { Request, Response } from "express";
import CategoryModel from "../../models/category.model.js";
import { escapeRegExp } from "../../utils/extra.utils.js";
import ProductModel from "../../models/product.model.js";
import { getAuthData } from "../../utils/auth.helper.js";
import CartModel from "../../models/cart.model";
import { ClientSession } from "mongoose";

async function getCartsByUserController(req: Request, res: Response) {
    const { user } = getAuthData(req);
    const { page, limit } = req.query as unknown as {
        page: number;
        limit: number;
    };
    const totalCount = await CartModel.countDocuments({
        user: user._id,
    });
    const carts = await CartModel.find({
        user: user._id,
    })
        .skip((page - 1) * limit)
        .limit(limit);
    return res.status(200).json({
        success: true,
        data: carts,
        message: "Carts fetched successfully",
        page,
        limit,
        totalCount,
    });
}

async function getCartByIdController(req: Request, res: Response) {
    const { user } = getAuthData(req);
    const { id } = req.params;
    const cart = await CartModel.findOne({
        _id: id,
    });
    if (!cart) {
        throw generateAPIError("Cart not found", 404);
    }
    if (user.role === "user" && cart.user.toString() !== user._id.toString()) {
        throw generateAPIError("Cart does't belong to the user", 401);
    }
    return res.status(200).json({
        success: true,
        data: cart,
        message: "Cart fetched successfully",
    });
}

async function getCurrentCartOfUserController(req: Request, res: Response) {
    const { user } = getAuthData(req);
    let cart = await CartModel.findOne({
        user: user._id,
        cartStatus: "pending",
    });
    if (!cart) {
        cart = new CartModel({
            user: user._id,
            cartStatus: "pending",
        });
        await cart.save();
    }
    return res.status(200).json({
        success: true,
        data: cart,
        message: "Cart fetched successfully",
    });
}

async function addProductToCartController(req: Request, res: Response) {
    const { user } = getAuthData(req);
    const { productId, quantity } = req.body;
    const product = await ProductModel.findOne({
        _id: productId,
    });
    if (!product) {
        throw generateAPIError("Product not found", 404);
    }
    let cart = await CartModel.findOne({
        user: user._id,
        cartStatus: "pending",
    });
    if (!cart) {
        throw generateAPIError(
            "Cart not found, get the current cart first",
            404,
        );
    }
    const existingProductIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId,
    );
    if (existingProductIndex > -1) {
        cart.products[existingProductIndex].quantity += quantity;
        if (cart.products[existingProductIndex].quantity <= 0) {
            cart.products.splice(existingProductIndex, 1);
        } else if (
            cart.products[existingProductIndex].quantity > product.countInStock
        ) {
            throw generateAPIError("Product stock is not enough", 400);
        }
    } else {
        if (quantity > product.countInStock) {
            throw generateAPIError("Product stock is not enough", 400);
        }
        if (quantity >= 0) {
            cart.products.push({
                product: productId,
                quantity,
            });
        }
    }
    cart.totalAmount += product.price * quantity;
    await cart.save();
    return res.status(200).json({
        success: true,
        data: cart,
        message: "Product added to cart successfully",
    });
}

async function removeProductFromCartController(req: Request, res: Response) {
    const { user } = getAuthData(req);
    const { productId } = req.body;
    let cart = await CartModel.findOne({
        user: user._id,
        cartStatus: "pending",
    });
    if (!cart) {
        throw generateAPIError(
            "Cart not found, get the current cart first",
            404,
        );
    }
    const existingProductIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId,
    );
    if (existingProductIndex === -1) {
        throw generateAPIError("Product not found in cart", 404);
    }
    const product = await ProductModel.findOne({
        _id: productId,
    });
    if (!product) {
        throw generateAPIError("Product not found", 404);
    }
    cart.totalAmount -=
        product.price * cart.products[existingProductIndex].quantity;
    cart.products.splice(existingProductIndex, 1);
    await cart.save();
    return res.status(200).json({
        success: true,
        data: cart,
        message: "Product removed from cart successfully",
    });
}

async function checkoutCartController(
    req: Request,
    res: Response,
    session: ClientSession,
) {
    const { user } = getAuthData(req);
    let cart = await CartModel.findOne(
        {
            user: user._id,
            cartStatus: "pending",
        },
        {},
        { session },
    );
    if (!cart) {
        throw generateAPIError(
            "Cart not found, get the current cart first",
            404,
        );
    }
    cart.cartStatus = "ordered";
    for (const product of cart.products) {
        const dbProduct = await ProductModel.findOne(
            {
                _id: product.product,
            },
            {},
            { session },
        );
        if (!dbProduct) {
            throw generateAPIError("Product not found", 404);
        }
        dbProduct.countInStock -= product.quantity;
        if (dbProduct.countInStock < 0) {
            throw generateAPIError(
                `Product ${dbProduct.name} is out of stock`,
                400,
            );
        }
        await dbProduct.save({ session });
    }
    await cart.save({ session });
    return res.status(200).json({
        success: true,
        data: cart,
        message: "Cart checked out successfully",
    });
}

export {
    getCartsByUserController,
    getCartByIdController,
    getCurrentCartOfUserController,
    addProductToCartController,
    removeProductFromCartController,
    checkoutCartController,
};
