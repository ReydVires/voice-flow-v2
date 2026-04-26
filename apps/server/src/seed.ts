import { db, pool } from './db';
import { users } from './db/schema';

async function seed() {
  console.log('Seeding initial data...');

  const reporters = [
    {
      username: 'reporter_jkt',
      email: 'reporter1@example.com',
      password: 'password123',
      role: 'REPORTER',
      location: 'Jakarta',
      availability: true,
    },
    {
      username: 'reporter_bdg',
      email: 'reporter2@example.com',
      password: 'password123',
      role: 'REPORTER',
      location: 'Bandung',
      availability: true,
    },
    {
      username: 'reporter_sby',
      email: 'reporter3@example.com',
      password: 'password123',
      role: 'REPORTER',
      location: 'Surabaya',
      availability: true,
    },
  ];

  const editors = [
    {
      username: 'editor1',
      email: 'editor1@example.com',
      password: 'password123',
      role: 'EDITOR',
      availability: true,
    },
    {
      username: 'editor2',
      email: 'editor2@example.com',
      password: 'password123',
      role: 'EDITOR',
      availability: true,
    },
  ];

  try {
    for (const u of [...reporters, ...editors]) {
      await db.insert(users).values(u).onConflictDoNothing();
    }
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await pool.end();
  }
}

seed();
