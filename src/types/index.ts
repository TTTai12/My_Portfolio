// Type definitions for API responses
// These should match the backend Mongoose models

export interface Project {
  _id: string;
  title: string;
  description: string;
  tech: string[];
  codeUrl: string;
  liveUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface About {
  _id: string;
  name: string;
  bio: string;
  avatar: string;
  location: string;
  email: string;
  phone: string;
  experienceYears: number;
  projectsCompleted: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  _id: string;
  name: string;
  level: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Experience {
  _id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Education {
  _id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt?: string;
  updatedAt?: string;
}
