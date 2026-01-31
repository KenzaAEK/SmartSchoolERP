
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
}

export interface Student extends User {
  class: string;
  attendanceRate: number;
  nextExam: string;
}

export interface Grade {
  id: string;
  subject: string;
  value: number;
  weight: number;
  date: string;
  teacherName: string;
}

export interface AIRecommendation {
  major: string;
  score: number; // 0-100
  description: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface Course {
  id: string;
  name: string;
  teacher: string;
  color: string;
}

export interface ScheduleSlot {
  day: number; // 0 (Mon) to 4 (Fri)
  hour: number; // 8 to 17 (index)
  courseId: string | null;
  room?: string;
}

export interface Schedule {
  classId: string;
  slots: ScheduleSlot[];
}

export interface PredictionData {
  month: string;
  successRate: number;
  predictedRate: number;
}
