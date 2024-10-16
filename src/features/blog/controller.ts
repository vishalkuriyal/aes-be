import { Request, Response } from "express";
import { Blog } from "../../models/blog.model";
import { deleteFileFromDrive, uploadFileToDrive } from "../../utils/drive";

export const handleGetBlogs = async (req: Request, res: Response) => {
  try {
    // Get limit and page from query parameters, and set defaults if not provided
    const limit = parseInt(req.query.limit as string) || 9; // Default limit to 9 if not provided
    const page = parseInt(req.query.page as string) || 1;   // Default page to 1 if not provided

    // Calculate how many documents to skip for pagination
    const skip = (page - 1) * limit;

    // Fetch blogs with pagination
    const blogs = await Blog.find().skip(skip).limit(limit);

    // Get the total number of blogs for calculating total pages
    const totalBlogs = await Blog.countDocuments();

    // Calculate total number of pages
    const totalPages = Math.ceil(totalBlogs / limit);

    res.status(200).json({
      blogs,
      currentPage: page,
      totalPages,
      totalBlogs,
    });
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

export const handleGetSingleBlogById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findById({ _id: id });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
}

export const handleDeleteBlog = async (req: Request, res: Response) => {
  try {
    const id = req.params.blogId;
    await Blog.findByIdAndDelete({ _id: id });
    console.log('Blog deleted successfully!');
    res.status(200).json({ message: 'Blog deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
}

export const handleUpdateBlog = async (req: Request, res: Response) => {

  if (!req.file) {
    res.status(400).json({ message: 'Company image is required.' });
    return
  }

  try {
    const blogId = req.params.jobId;

    // find old job
    const oldJob = await Blog.findById({ _id: blogId });

    const imageUrl = oldJob?.image as string;

    const imageFileId = imageUrl.split("=")[1];

    // Delete old image from Google Drive
    await deleteFileFromDrive(imageFileId);

    // Upload the company image to Google Drive
    const filePath = req.file.path; // Path of the uploaded file
    const fileName = req.file.originalname; // Original file name
    const blogImageUrl = await uploadFileToDrive(filePath, fileName);

    const blog = req.body;

    blog.image = blogImageUrl;
    blog.date = new Date();

    await Blog.findByIdAndUpdate({ _id: blogId }, blog);
    res.status(200).json({ message: 'Blog updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
}

export const handleCreateBlogs = async (req: Request, res: Response) => {

  // Ensure the image file is uploaded
  if (!req.file) {
    res.status(400).json({ message: 'Company image is required.' });
    return
  }

  try {
    const { title, description, subDescription, author, tags, content } = req.body;

    const date = new Date();

    // Upload the company image to Google Drive
    const filePath = req.file.path; // Path of the uploaded file
    const fileName = req.file.originalname; // Original file name
    const image = await uploadFileToDrive(filePath, fileName);

    const newBlog = new Blog({
      title,
      description,
      subDescription,
      author,
      date,
      content,
      tags,
      image
    });
    await newBlog.save();

    res.status(201).json({ message: 'Blog created successfully!', blog: newBlog });
  } catch (error: any) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'An unexpected error occurred.', error: error.message });
  }
}
