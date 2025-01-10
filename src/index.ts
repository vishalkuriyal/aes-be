import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { router } from './routes';
import session from 'express-session';
import { google } from 'googleapis';
import cors from 'cors';
import { connectToDatabase } from './utils/db';
const MongoStore = require('connect-mongodb-session')(session);

dotenv.config();
const app = express();

const store = new MongoStore({
  uri: process.env.MONGODB_URI as string,
  collection: 'sessions',
});

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

export let storedTokens: any = null;

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost:3030/oauth2callback' // Your redirect URL
);

// Route to generate the authorization URL
app.get('/auth/google', (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/drive'];
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });

  res.redirect(authorizeUrl);
});

// OAuth2 callback route
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code as string;

  if (!code) {
    res.status(400).send('Missing authorization code');
    return;
  }

  try {
    // Exchange the authorization code for an access token
    const { tokens } = await oauth2Client.getToken(code);

    storedTokens = tokens;
    oauth2Client.setCredentials(tokens);

    res.send('Authorization successful!');
  } catch (error) {
    console.error('Error during token exchange:', error);
    res.status(500).send('Error during token exchange');
  }
});

// Middleware to check if access token is expired and refresh it
export const ensureAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!storedTokens || !storedTokens.access_token) {
    res.status(401).send('User not authenticated');
    return;
  }

  // If the access token is expired, refresh it
  if (new Date(storedTokens.expiry_date) < new Date()) {
    try {
      // Refresh the token using the stored refresh token
      const { credentials } = await oauth2Client.refreshAccessToken();
      storedTokens = credentials;

      // Set the refreshed credentials
      oauth2Client.setCredentials(storedTokens);
    } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(500).send('Error refreshing token');
      return;
    }
  }
  next();
};

if (process.env.PRODUCTION === 'false') {
  app.set('trust proxy', 1);
  app.use(
    session({
      secret: process.env.SECRET as string,
      resave: false,
      saveUninitialized: true,
      store: store,
    })
  );
} else {
  app.set('trust proxy', 1);
  app.use(
    session({
      secret: process.env.SECRET as string,
      resave: false,
      saveUninitialized: true,
      store: store,
      cookie: {
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );
}

const allowedOrigins = [
  'http://localhost:3000',
  'https://aes-website.vercel.app',
  'aes-website.vercel.app',
  'https://aes-website.vercel.app/',
  'https://aesrecruitment.com',
  'https://www.aesrecruitment.com',
  'http://aesrecruitment.com',
];
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(express.json());
const PORT = process.env.PORT || 3030;

app.use('/api', router);

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 server is running on: PORT ${PORT}\n`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
