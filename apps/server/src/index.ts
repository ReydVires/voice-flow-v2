import express, { type Response, type Request } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { db, pool } from './db';
import { users, jobs } from './db/schema';
import { eq, and } from 'drizzle-orm';
import type { ApiResponse, JobStatus, UserRole } from '@mern/types';

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

export const errorResponse = (res: Response, message: string = 'Internal server error', code: number = 500): void => {
  res.status(code).json({
    success: false,
    message,
    code,
  });
};

// Payment Constants
const REPORTER_RATE_PER_MIN = 2000;
const EDITOR_FLAT_FEE = 100000;

const calculatePayments = (duration: number) => {
  const reporterEarnings = duration * REPORTER_RATE_PER_MIN;
  const editorEarnings = EDITOR_FLAT_FEE;
  return {
    reporterEarnings,
    editorEarnings,
    totalPayout: reporterEarnings + editorEarnings,
  };
};

app.get('/api/health', (_, res) => {
  successResponse(res, { status: 'ok' });
});

// Job Endpoints
app.post('/api/jobs', async (req: Request, res: Response) => {
  try {
    const { caseName, duration, locationType, locationName } = req.body;
    const [newJob] = await db.insert(jobs).values({
      caseName,
      duration,
      locationType,
      locationName,
      status: 'NEW',
    }).returning();
    successResponse(res, newJob, 'Job created successfully', 201);
  } catch (error) {
    console.error('Error creating job:', error);
    errorResponse(res);
  }
});

app.get('/api/jobs', async (_, res: Response) => {
  try {
    const allJobs = await db.query.jobs.findMany({
      with: {
        reporter: true,
        editor: true,
      },
      orderBy: (jobs, { desc }) => [desc(jobs.createdAt)],
    });

    const jobsWithPayments = allJobs.map(job => ({
      ...job,
      payments: calculatePayments(job.duration),
    }));

    successResponse(res, jobsWithPayments, 'Jobs fetched successfully');
  } catch (error) {
    console.error('Error fetching jobs:', error);
    errorResponse(res);
  }
});

app.get('/api/jobs/:id', async (req: Request, res: Response) => {
  try {
    const job = await db.query.jobs.findFirst({
      where: eq(jobs.id, req.params.id),
      with: {
        reporter: true,
        editor: true,
      },
    });

    if (!job) return errorResponse(res, 'Job not found', 404);

    const jobWithPayments = {
      ...job,
      payments: calculatePayments(job.duration),
    };

    successResponse(res, jobWithPayments, 'Job details fetched successfully');
  } catch (error) {
    console.error('Error fetching job details:', error);
    errorResponse(res);
  }
});

app.patch('/api/jobs/:id/assign-reporter', async (req: Request, res: Response) => {
  try {
    const { reporterId } = req.body;
    const [updatedJob] = await db.update(jobs)
      .set({
        reporterId,
        status: 'ASSIGNED',
        updatedAt: new Date()
      })
      .where(eq(jobs.id, req.params.id))
      .returning();
    successResponse(res, updatedJob, 'Reporter assigned successfully');
  } catch (error) {
    console.error('Error assigning reporter:', error);
    errorResponse(res);
  }
});

app.patch('/api/jobs/:id/assign-editor', async (req: Request, res: Response) => {
  try {
    const { editorId } = req.body;
    const [updatedJob] = await db.update(jobs)
      .set({
        editorId,
        updatedAt: new Date()
      })
      .where(eq(jobs.id, req.params.id))
      .returning();
    successResponse(res, updatedJob, 'Editor assigned successfully');
  } catch (error) {
    console.error('Error assigning editor:', error);
    errorResponse(res);
  }
});

app.patch('/api/jobs/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const [updatedJob] = await db.update(jobs)
      .set({
        status,
        updatedAt: new Date()
      })
      .where(eq(jobs.id, req.params.id))
      .returning();
    successResponse(res, updatedJob, 'Status updated successfully');
  } catch (error) {
    console.error('Error updating status:', error);
    errorResponse(res);
  }
});

// User Endpoints
app.get('/api/reporters', async (req: Request, res: Response) => {
  try {
    const jobId = req.query.jobId as string;
    let availableReporters = await db.select().from(users).where(
      and(
        eq(users.role, 'REPORTER'),
        eq(users.availability, true)
      )
    );

    if (jobId) {
      const job = await db.query.jobs.findFirst({ where: eq(jobs.id, jobId) });
      if (job && job.locationType === 'physical' && job.locationName) {
        // Sort by same city preference
        availableReporters.sort((a, b) => {
          if (a.location === job.locationName && b.location !== job.locationName) return -1;
          if (a.location !== job.locationName && b.location === job.locationName) return 1;
          return 0;
        });
      }
    }

    successResponse(res, availableReporters, 'Reporters fetched successfully');
  } catch (error) {
    console.error('Error fetching reporters:', error);
    errorResponse(res);
  }
});

app.get('/api/editors', async (_, res: Response) => {
  try {
    const availableEditors = await db.select().from(users).where(
      and(
        eq(users.role, 'EDITOR'),
        eq(users.availability, true)
      )
    );
    successResponse(res, availableEditors, 'Editors fetched successfully');
  } catch (error) {
    console.error('Error fetching editors:', error);
    errorResponse(res);
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

  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
