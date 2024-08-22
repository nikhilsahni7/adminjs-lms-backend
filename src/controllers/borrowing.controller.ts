import type { Request, Response } from "express";
import { Borrowing } from "../models/borrowing.model";
import { Book } from "../models/book.model";

export const borrowBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, bookId } = req.body;
    const book = await Book.findById(bookId);
    if (!book || book.availableQuantity === 0) {
      res.status(400).json({ message: "Book not available" });
      return;
    }
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    const borrowing = new Borrowing({
      user: userId,
      book: bookId,
      dueDate,
    });
    await borrowing.save();
    book.availableQuantity -= 1;
    await book.save();
    res.status(201).json(borrowing);
  } catch (error) {
    res.status(500).json({ message: "Error borrowing book", error });
  }
};

export const returnBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { borrowingId } = req.params;
    const borrowing = await Borrowing.findById(borrowingId);
    if (!borrowing || borrowing.returnDate) {
      res
        .status(400)
        .json({ message: "Invalid borrowing or book already returned" });
      return;
    }
    borrowing.returnDate = new Date();
    await borrowing.save();
    const book = await Book.findById(borrowing.book);
    if (book) {
      book.availableQuantity += 1;
      await book.save();
    }
    res.json(borrowing);
  } catch (error) {
    res.status(500).json({ message: "Error returning book", error });
  }
};

export const getBorrowings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const borrowings = await Borrowing.find().populate("user book");
    res.json(borrowings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching borrowings", error });
  }
};

export const getOverdueBorrowings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const overdueBorrowings = await Borrowing.find({
      returnDate: null,
      dueDate: { $lt: new Date() },
    }).populate("user book");
    res.json(overdueBorrowings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching overdue borrowings", error });
  }
};
