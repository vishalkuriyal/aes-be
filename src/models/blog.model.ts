import { model, Schema } from "mongoose";
import { BlogType } from "src/types/types";

const blogSchema = new Schema<BlogType>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  description: { type: String, required: true },
  subDescription: { type: String, required: true },
  image: { type: String },
  author: { type: String, required: true },
  date: { type: Date, required: true },
  tags: { type: [String], required: true },
});

export const Blog = model<BlogType>("Blog", blogSchema);
