import { create } from 'zustand';
import { Assignment, AssignmentFormData } from '@/types';
import { createAssignment, getAssignments } from '@/lib/api';

interface AssignmentStore {
  assignments: Assignment[];
  isLoading: boolean;
  error: string | null;
  fetchAssignments: () => Promise<void>;
  submitAssignment: (data: AssignmentFormData) => Promise<string>;
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignments: [],
  isLoading: false,
  error: null,

  fetchAssignments: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getAssignments();
      set({ assignments: data, isLoading: false });
    } catch {
      set({ error: 'Failed to fetch assignments', isLoading: false });
    }
  },

  submitAssignment: async (data: AssignmentFormData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await createAssignment(data);
      set({ isLoading: false });
      return res.assignmentId;
    } catch {
      set({ error: 'Failed to create assignment', isLoading: false });
      throw new Error('Failed to create assignment');
    }
  },
}));