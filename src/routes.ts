import express from 'express';
import { pingServerRouter, authRouter, jobsRouter } from './features';
import { blogsRouter } from './features/blog/route';

export const router = express.Router();

router.use('/ping', pingServerRouter);
router.use('/auth', authRouter);
router.use('/jobs', jobsRouter);
router.use('/blogs', blogsRouter);
