import express from 'express';
import {
  handleGetJobs,
  handleCreateJobs,
  handleJobUpdate,
  handleDeleteJob,
  handleGetSingleJob,
} from './controller';
import { isAuth } from '../auth/controller';
import multer from 'multer';
import { ensureAuthenticated } from '../../index';

const upload = multer({ dest: 'uploads/' }); // Directory for uploaded files

export const jobsRouter = express.Router();

jobsRouter.get('/get', handleGetJobs);
jobsRouter.get('/get/:id', handleGetSingleJob);
jobsRouter.post(
  '/create',
  isAuth,
  (req, res) => {
    ensureAuthenticated;
  },
  upload.single('companyImage'),
  handleCreateJobs
);
jobsRouter.post(
  '/update/:jobId',
  isAuth,
  (req, res) => {
    ensureAuthenticated;
  },
  upload.single('companyImage'),
  handleJobUpdate
);
jobsRouter.delete('/delete/:jobId', isAuth, handleDeleteJob);
// jobsRouter.post('/upload', upload.single('companyImage'), handleUploadJob);
