
export enum ApplicationStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  UNDER_REVIEW = 'Under Review',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface Course {
  id: string;
  name: string;
  department: string;
  duration: string;
  description: string;
  eligibility: string;
  image: string;
}

export interface ApplicationData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  courseId: string;
  prevSchool: string;
  percentage: number;
  entranceScore?: string;
  statement?: string;
  uploadedFiles?: string[];
  status: ApplicationStatus;
  submittedAt: string;
}

export type ViewState = 'HOME' | 'APPLY' | 'STATUS' | 'ADMIN' | 'ADMIN_LOGIN' | 'COURSES';
