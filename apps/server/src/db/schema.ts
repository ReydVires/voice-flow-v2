import { pgTable, uuid, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  username: text('username').notNull().unique(),
  role: text('role').notNull().default('REPORTER'), // REPORTER, EDITOR, ADMIN
  location: text('location'),
  availability: boolean('availability').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const jobs = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  caseName: text('case_name').notNull(),
  duration: integer('duration').notNull(), // minutes
  locationType: text('location_type').notNull(), // physical, remote
  locationName: text('location_name'),
  status: text('status').notNull().default('NEW'), // NEW, ASSIGNED, TRANSCRIBED, REVIEWED, COMPLETED
  reporterId: uuid('reporter_id').references(() => users.id),
  editorId: uuid('editor_id').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const jobsRelations = relations(jobs, ({ one }) => ({
  reporter: one(users, {
    fields: [jobs.reporterId],
    references: [users.id],
    relationName: 'reporter',
  }),
  editor: one(users, {
    fields: [jobs.editorId],
    references: [users.id],
    relationName: 'editor',
  }),
}));

export type User = typeof users.$inferSelect;
export type Job = typeof jobs.$inferSelect;
