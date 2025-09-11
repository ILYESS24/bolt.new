import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface File {
  name: string;
  content: string;
  language: string;
  path: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  files: File[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  userId?: string;
}

interface AppState {
  // Current project
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  
  // Files
  files: File[];
  setFiles: (files: File[]) => void;
  updateFile: (path: string, content: string) => void;
  addFile: (file: File) => void;
  deleteFile: (path: string) => void;
  
  // Active file
  activeFile: string | null;
  setActiveFile: (path: string | null) => void;
  
  // AI Generation
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Terminal
  terminalOutput: string[];
  addTerminalOutput: (output: string) => void;
  clearTerminal: () => void;
  
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Current project
      currentProject: null,
      setCurrentProject: (project) => set({ currentProject: project }),
      
      // Files
      files: [],
      setFiles: (files) => set({ files }),
      updateFile: (path, content) => {
        const files = get().files.map(file => 
          file.path === path ? { ...file, content } : file
        );
        set({ files });
      },
      addFile: (file) => {
        const files = [...get().files, file];
        set({ files });
      },
      deleteFile: (path) => {
        const files = get().files.filter(file => file.path !== path);
        set({ files });
      },
      
      // Active file
      activeFile: null,
      setActiveFile: (path) => set({ activeFile: path }),
      
      // AI Generation
      isGenerating: false,
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      
      // UI State
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // Terminal
      terminalOutput: [],
      addTerminalOutput: (output) => {
        const terminalOutput = [...get().terminalOutput, output];
        set({ terminalOutput });
      },
      clearTerminal: () => set({ terminalOutput: [] }),
      
      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'bolt-app-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);