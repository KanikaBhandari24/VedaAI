import axios from 'axios';
import { AssignmentFormData, Assignment, AssignmentWithResult } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
});

export const createAssignment = async (data: AssignmentFormData) => {
  const res = await api.post<{ assignmentId: string; status: string }>('/assignments', data);
  return res.data;
};

export const getAssignments = async () => {
  const res = await api.get<Assignment[]>('/assignments');
  return res.data;
};

export const getAssignment = async (id: string) => {
  const res = await api.get<AssignmentWithResult>(`/assignments/${id}`);
  return res.data;
};

export const deleteAssignment = async (id: string) => {
  const res = await api.delete(`/assignments/${id}`);
  return res.data;
};