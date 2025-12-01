import { create } from 'zustand';
import axiosClient from '@/lib/axiosClient';

export interface Section {
  id: number;
  title: string;
  content: string;
  order: number;
  project_id: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  title: string;
  document_type: 'docx' | 'pptx';
  main_topic: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  sections: Section[];
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  fetchProjects: () => Promise<void>;
  fetchProject: (id: number) => Promise<void>;
  createProject: (data: any) => Promise<Project>;
  updateProject: (id: number, data: any) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  updateSection: (sectionId: number, data: any) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosClient.get('/projects');
      set({ projects: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchProject: async (id: number) => {
    set({ isLoading: true });
    try {
      const response = await axiosClient.get(`/projects/${id}`);
      set({ currentProject: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createProject: async (data: any) => {
    const response = await axiosClient.post('/projects', data);
    set((state) => ({ projects: [...state.projects, response.data] }));
    return response.data;
  },

  updateProject: async (id: number, data: any) => {
    const response = await axiosClient.put(`/projects/${id}`, data);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? response.data : p)),
      currentProject: state.currentProject?.id === id ? response.data : state.currentProject,
    }));
  },

  deleteProject: async (id: number) => {
    await axiosClient.delete(`/projects/${id}`);
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    }));
  },

  updateSection: async (sectionId: number, data: any) => {
    const response = await axiosClient.put(`/sections/${sectionId}`, data);
    set((state) => {
      if (!state.currentProject) return state;
      return {
        currentProject: {
          ...state.currentProject,
          sections: state.currentProject.sections.map((s) =>
            s.id === sectionId ? response.data : s
          ),
        },
      };
    });
  },

  setCurrentProject: (project: Project | null) => {
    set({ currentProject: project });
  },
}));
