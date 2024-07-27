import UserModel from "../models/user.model";
import { hashPassword } from "../utils/bcrypt.utils";
import connectDB from "../utils/connectDB.utils";
import { USER_ROLE_ENUM } from "../utils/enums.utils";

const addAdmin = async () => {
    const checkAdmin = await UserModel.findOne({ role: USER_ROLE_ENUM.ADMIN });
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
    await admin.save();
    console.log("Admin added successfully");
};

const seedDb = async () => {
    await connectDB(process.env.MONGO_URI || "");
    await addAdmin();
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
