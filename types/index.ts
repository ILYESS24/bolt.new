export interface Project {
  id: string;
  name: string;
  description?: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  isPublic: boolean;
  files?: File[];
  template?: string;
}

export interface File {
  name: string;
  content: string;
  language: string;
  path: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  content?: string;
  isPublic?: boolean;
  template?: string;
  files?: File[];
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  content?: string;
  isPublic?: boolean;
  files?: File[];
}

export interface AIGenerationRequest {
  prompt: string;
  context?: string;
  language?: string;
  framework?: string;
}

export interface AIGenerationResponse {
  code: string;
  explanation?: string;
  files?: File[];
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  files: File[];
  framework: string;
  language: string;
}