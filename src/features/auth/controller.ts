import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import User, { IUser } from '../../models/user.model';
import { UserSchema, UserLoginSchema } from './validator';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    // Validate the request body against our schema
    const validatedData = UserSchema.parse(req.body);

    // Check if user already exists using email
    const existingUser = await User.findOne({
      email: validatedData.email,
    });

    if (existingUser) {
      res
        .status(400)
        .json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // Create a new user
    const newUser = new User({
      ...validatedData,
      password: hashedPassword,
    });

    // Save the user and settings
    await newUser.save();

    // Set user session
    req.session.userId = (newUser._id as string).toString();

    // Send a success response
    res.status(201).json({
      registered: true,
      user: newUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else if (error instanceof Error) {
      res.status(500).json({
        message: 'An unexpected error occurred',
        error: error.message,
      });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const validatedData = UserLoginSchema.parse(req.body);

    // Find the user
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    // Set user session
    req.session.userId = (user._id as string).toString();

    // Send success response
    res.json({
      loggedIn: true,
      user: user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else if (error instanceof Error) {
      res.status(500).json({
        message: 'An unexpected error occurred',
        error: error.message,
      });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (error) {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
  res.status(401).json({ message: 'Unauthorized' });
};

export const logoutUser = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'An unexpected error occurred' });
    }
    res.clearCookie('qid');
    res.json({ loggedOut: true });
  });
};
