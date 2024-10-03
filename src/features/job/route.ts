import express from 'express';
import { handleGetJobs, handleCreateJobs, handleJobUpdate, handleDeleteJob } from './controller';
import { isAuth } from '../auth/controller';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); // Directory for uploaded files

export const jobsRouter = express.Router();

jobsRouter.get('/get', handleGetJobs);
jobsRouter.post('/create', isAuth, upload.single('companyImage'), handleCreateJobs);
jobsRouter.post('/update/:jobId', isAuth, upload.single('companyImage'), handleJobUpdate);
jobsRouter.delete('/delete/:jobId', isAuth, handleDeleteJob);
// jobsRouter.post('/upload', upload.single('companyImage'), handleUploadJob);
