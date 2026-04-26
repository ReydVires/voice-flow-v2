export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  code: number;
  data?: T;
}

export type JobStatus = 'NEW' | 'ASSIGNED' | 'TRANSCRIBED' | 'REVIEWED' | 'COMPLETED';
export type UserRole = 'REPORTER' | 'EDITOR' | 'ADMIN';
export type LocationType = 'physical' | 'remote';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  location?: string;
  availability: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  caseName: string;
  duration: number; // in minutes
  locationType: LocationType;
  locationName?: string;
  status: JobStatus;
  reporterId?: string;
  editorId?: string;
  reporter?: User;
  editor?: User;
  createdAt: Date;
  updatedAt: Date;
  payments?: JobPayments;
}

export interface JobPayments {
  reporterEarnings: number;
  editorEarnings: number;
  totalPayout: number;
}
