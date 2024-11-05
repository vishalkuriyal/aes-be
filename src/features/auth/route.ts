import express, { Request, Response } from 'express';
import { isAuth, loginUser, logoutUser } from './controller';

export const authRouter = express.Router();
// authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);
authRouter.get('/me', isAuth, (req: Request, res: Response) => {
  res.json({ user: req.user, status: 200 });
});
