import { Schema, model, Document } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  availableQuantity: number;
}

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true, min: 0 },
  availableQuantity: { type: Number, required: true, min: 0 },
});

export const Book = model<IBook>("Book", bookSchema);
