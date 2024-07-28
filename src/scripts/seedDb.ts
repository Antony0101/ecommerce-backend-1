import CartModel from "../models/cart.model";
import CategoryModel from "../models/category.model";
import ProductModel from "../models/product.model";
import UserModel from "../models/user.model";
import { hashPassword } from "../utils/bcrypt.utils";
import connectDB from "../utils/connectDB.utils";
import { USER_ROLE_ENUM } from "../utils/enums.utils";
import mongoose, { ClientSession } from "mongoose";

const addAdmin = async (session: ClientSession) => {
    const checkAdmin = await UserModel.findOne(
        { role: USER_ROLE_ENUM.ADMIN },
        {},
        { session },
    );
    if (checkAdmin) {
        console.log("Admin already exists");
        return;
    }
    const admin = new UserModel({
        email: "admin@ecommerce.com",
        password: await hashPassword("admin"),
        firstName: "Admin",
        lastName: "User",
        role: USER_ROLE_ENUM.ADMIN,
    });
    await admin.save({ session });
    console.log("Admin added successfully");
};

const addProducts = async (session: ClientSession) => {
    const product = await ProductModel.findOne({}, {}, { session });
    if (product) {
        console.log("Products already exists");
        return;
    }

    const category1 = new CategoryModel({
        name: "Electronics",
        description: "Electronics items",
        image: "sample-image",
    });
    await category1.save({ session });

    const category2 = new CategoryModel({
        name: "Clothing",
        description: "Clothing items",
        image: "sample-image",
    });
    await category2.save({ session });

    const product1 = new ProductModel({
        name: "Laptop",
        description: "Laptop description",
        price: 50000,
        image: "sample-image",
        category: category1._id,
        color: "Black",
        countInStock: 10,
        rating: 4.5,
        numReviews: 10,
    });
    await product1.save({ session });

    const product2 = new ProductModel({
        name: "T-shirt",
        description: "T-shirt description",
        price: 500,
        image: "sample-image",
        category: category2._id,
        color: "Red",
        countInStock: 100,
        rating: 4.0,
        numReviews: 100,
    });
    await product2.save({ session });

    const product3 = new ProductModel({
        name: "Mobile",
        description: "Mobile description",
        price: 15000,
        image: "sample-image",
        category: category1._id,
        color: "White",
        countInStock: 50,
        rating: 4.2,
        numReviews: 50,
    });
    await product3.save({ session });

    const product4 = new ProductModel({
        name: "Jeans",
        description: "Jeans description",
        price: 1000,
        image: "sample-image",
        category: category2._id,
        color: "Blue",
        countInStock: 200,
        rating: 4.0,
        numReviews: 200,
    });
    await product4.save({ session });

    console.log("Products added successfully");
};

const seedDb = async () => {
    await connectDB(process.env.MONGO_URI || "");
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        await addAdmin(session);
        await addProducts(session);
        await session.commitTransaction();
        await session.endSession();
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
};

seedDb()
    .then(() => {
        console.log("DB seeded successfully");
        process.exit(0);
    })
    .catch((err) => {
        console.log("Error seeding DB \n", err);
        process.exit(1);
    });
