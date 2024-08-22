import express from "express";
import {
  borrowBook,
  returnBook,
  getBorrowings,
  getOverdueBorrowings,
} from "../controllers/borrowing.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, borrowBook);
router.put("/:borrowingId/return", authMiddleware, returnBook);
router.get("/", authMiddleware, getBorrowings);
router.get("/overdue", authMiddleware, getOverdueBorrowings);

export default router;
