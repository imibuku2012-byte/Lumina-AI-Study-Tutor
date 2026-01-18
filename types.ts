
export type GradeLevel = 'Grade 6-8' | 'Grade 9-10' | 'Grade 11-12' | 'University';
export type Language = 'English';

export type Subject = 
  | 'Mathematics' 
  | 'Calculus' 
  | 'Physics' 
  | 'Chemistry' 
  | 'Biology' 
  | 'History' 
  | 'Languages' 
  | 'Afrikaans'
  | 'Computer Science' 
  | 'Economics' 
  | 'Other';

export interface AdminSettings {
  globalAnnouncement: string;
  aiModifier: string;
}

export interface UserProfile {
  email: string;
  name: string;
  country: string;
  language: Language;
  isAdmin?: boolean;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  sources?: GroundingSource[];
  isThinking?: boolean;
  quiz?: QuizQuestion;
}

export enum AppState {
  AUTH = 'AUTH',
  ONBOARDING = 'ONBOARDING',
  STUDYING = 'STUDYING',
  QUIZZING = 'QUIZZING',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}
