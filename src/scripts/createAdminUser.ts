import dotenv from "dotenv";
import { connectDatabase } from "../config/database";
import { User } from "../models/user.model";

dotenv.config();

const createAdminUser = async () => {
  await connectDatabase();

  const adminUser = new User({
    username: "admin",
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: "admin",
  });

  await adminUser.save();
  console.log("Admin user created successfully");
  process.exit(0);
};

createAdminUser().catch(console.error);
