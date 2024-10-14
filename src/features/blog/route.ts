import express from 'express';
import { handleCreateBlogs, handleDeleteBlog, handleGetBlogs, handleGetSingleBlogById, handleUpdateBlog } from './controller';
import { isAuth } from '../auth/controller';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); // Directory for uploaded files

export const blogsRouter = express.Router();

blogsRouter.get('/get', handleGetBlogs);
blogsRouter.get('/get/:id', handleGetSingleBlogById);
blogsRouter.post('/create', isAuth, upload.single('image'), handleCreateBlogs);
blogsRouter.post('/update/:blogId', isAuth, upload.single('image'), handleUpdateBlog);
blogsRouter.delete('/delete/:blogId', isAuth, handleDeleteBlog);
// jobsRouter.post('/upload', upload.single('companyImage'), handleUploadJob);
