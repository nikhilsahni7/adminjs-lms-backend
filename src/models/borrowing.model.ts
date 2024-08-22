import { Schema, model, Document, Types } from "mongoose";

export interface IBorrowing extends Document {
  user: Types.ObjectId;
  book: Types.ObjectId;
  borrowDate: Date;
  returnDate: Date | null;
  dueDate: Date;
}

const borrowingSchema = new Schema<IBorrowing>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  borrowDate: { type: Date, default: Date.now },
  returnDate: { type: Date, default: null },
  dueDate: { type: Date, required: true },
});

export const Borrowing = model<IBorrowing>("Borrowing", borrowingSchema);
