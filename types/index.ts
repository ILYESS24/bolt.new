export interface Project {
  id: string;
  title: string;
  description?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  isPublic: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
}

export interface CreateProjectData {
  title: string;
  description?: string;
  content?: string;
  isPublic?: boolean;
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  content?: string;
  isPublic?: boolean;
}