import mongoose from "mongoose";
import { ExtractDocument, ExtractEntity } from "../utils/mongoHelper.utils.js";
import { CART_STATUS_ENUM } from "../utils/enums.utils.js";

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        products: [
            {
                _id: false,
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalAmount: {
            type: Number,
            default: 0,
        },
        cartStatus: {
            type: String,
            enum: Object.values(CART_STATUS_ENUM),
            required: true,
            default: CART_STATUS_ENUM.PENDING,
        },
    },
    {
        timestamps: true,
    },
);

const CartModel = mongoose.model("carts", cartSchema);

export type CartEntity = ExtractEntity<typeof CartModel>;
export type CartDocument = ExtractDocument<typeof CartModel>;

export default CartModel;
