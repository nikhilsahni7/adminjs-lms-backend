import express from "express";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
import dotenv from "dotenv";
import { connectDatabase } from "./src/config/database";
import userRoutes from "./src/routes/user.routes";
import bookRoutes from "./src/routes/book.routes";
import borrowingRoutes from "./src/routes/borrowing.routes";
import { errorHandler } from "./src/middlewares/errorHandler.middleware";
import { User } from "./src/models/user.model";
import { Book } from "./src/models/book.model";
import { Borrowing } from "./src/models/borrowing.model";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDatabase();

// Middleware
app.use(express.json());

// AdminJS
AdminJS.registerAdapter(AdminJSMongoose);

const authenticate = async (email: string, password: string) => {
  const adminUser = await User.findOne({ email, role: "admin" });
  if (adminUser) {
    const matched = await adminUser.comparePassword(password);
    if (matched) {
      return adminUser;
    }
  }
  return false;
};

const canModifyUsers = ({ currentAdmin }: any) => {
  return currentAdmin && currentAdmin.role === "admin";
};

const adminJs = new AdminJS({
  resources: [
    {
      resource: User,
      options: {
        properties: {
          password: { isVisible: false },
        },
        actions: {
          new: {
            before: async (request: any) => {
              if (request.payload.password) {
                request.payload = {
                  ...request.payload,
                  password: request.payload.password, // The User model will hash this
                };
              }
              return request;
            },
          },
          edit: { isAccessible: canModifyUsers },
          delete: { isAccessible: canModifyUsers },
          view: { isAccessible: canModifyUsers },
        },
      },
    },
    {
      resource: Book,
      options: {
        // Add custom actions or properties for books
        actions: {
          new: {
            isAccessible: canModifyUsers,
          },
          edit: {
            isAccessible: canModifyUsers,
          },
          delete: {
            isAccessible: canModifyUsers,
          },
        },
      },
    },
    {
      resource: Borrowing,
      options: {
        // Add custom actions or properties for borrowings
        actions: {
          new: {
            isAccessible: canModifyUsers,
          },
          edit: {
            isAccessible: canModifyUsers,
          },
          delete: {
            isAccessible: canModifyUsers,
          },
        },
      },
    },
  ],
  rootPath: "/admin",
  dashboard: {
    handler: async () => {
      return { some: "stats" };
    },
  },
});

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate,
    cookieName: "adminjs",
    cookiePassword:
      process.env.ADMIN_COOKIE_SECRET || "complex-cookie-password-123456789",
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
  }
);

app.use(adminJs.options.rootPath, adminRouter);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrowings", borrowingRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
