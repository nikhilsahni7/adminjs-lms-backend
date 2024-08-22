import { Borrowing } from "../models/borrowing.model";
import { User } from "../models/user.model";

export const sendOverdueNotifications = async (): Promise<void> => {
  const overdueBorrowings = await Borrowing.find({
    returnDate: null,
    dueDate: { $lt: new Date() },
  }).populate("user book");

  for (const borrowing of overdueBorrowings) {
    const user = borrowing.user as any;
    const book = borrowing.book as any;
    console.log(
      `Sending overdue notification to ${user.email} for book "${book.title}"`
    );
    // Send email or SMS notification  later
  }
};
