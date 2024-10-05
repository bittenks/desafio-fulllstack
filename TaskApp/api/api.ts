// api/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Substitua pelo URL da sua API se não estiver em localhost
});

interface RegisterData {
  username: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface Task {
  id: number;
  descricao: string;
  status: string;
  responsavel: string;
}

export const registerUser = async (data: RegisterData) => {
  return await api.post('/auth/register', data);
};

export const loginUser = async (data: LoginData) => {
  return await api.post('/auth/login', data);
};

export const getTasks = async (token: string) => {
  return await api.get<Task[]>('/tasks', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createTask = async (data: Omit<Task, 'id'>, token: string) => {
  return await api.post('/tasks', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateTask = async (id: number, data: Omit<Task, 'id'>, token: string) => {
  return await api.patch(`/tasks/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteTask = async (id: number, token: string) => {
  return await api.delete(`/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getTaskById = async (id: number, token: string) => {
  return await api.get<Task>(`/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
