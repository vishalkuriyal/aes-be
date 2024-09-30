import dotenv from 'dotenv';
import express from 'express';
import { router } from './routes';
import session from 'express-session';
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

app.use(
  session({
    secret: process.env.SECRET as string,
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

const allowedOrigins = ['http://localhost:3000'];
app.use(
  cors({
    credentials: true,
    origin: function(origin, callback) {
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
