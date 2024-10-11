import express from 'express';
import { handleCreateBlogs, handleDeleteBlog, handleGetBlogs, handleUpdateBlog } from './controller';
import { isAuth } from '../auth/controller';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); // Directory for uploaded files

export const blogsRouter = express.Router();

blogsRouter.get('/get', handleGetBlogs);
blogsRouter.post('/create', isAuth, upload.single('companyImage'), handleCreateBlogs);
blogsRouter.post('/update/:blogId', isAuth, upload.single('companyImage'), handleUpdateBlog);
blogsRouter.delete('/delete/:blogId', isAuth, handleDeleteBlog);
// jobsRouter.post('/upload', upload.single('companyImage'), handleUploadJob);
