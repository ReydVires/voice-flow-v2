import express, { type Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { db, pool } from './db';
import { users } from './db/schema';
import type { ApiResponse } from '@mern/types';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

export const successResponse = <T = any>(res: Response, data: T, message: string = 'Success', code: number = 200): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    code,
    data,
  };
  res.status(code).json(response);
};

app.get('/api/health', (_, res) => {
  successResponse(res, { status: 'ok' });
});

app.get('/api/users', async (_, res) => {
  try {
    const allUsers = await db.select().from(users);
    successResponse(res, allUsers, 'Users fetched successfully');
  } catch (error) {
    console.error('Error fetching user:', error);
    successResponse(res, null, 'Internal server error', 500);
  }
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const gracefulShutdown = async (signal: string) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    console.log('HTTP server closed.');

    try {
      await pool.end();
      console.log('Database pool closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error during database pool shutdown:', err);
      process.exit(1);
    }
  });

  // Force close after 10s
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
