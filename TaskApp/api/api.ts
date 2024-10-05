// api/api.ts
import axios from 'axios';
import { Alert } from 'react-native';

const api = axios.create({
  baseURL: 'https://desafio-fulllstack.onrender.com',
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
  try {
    Alert.alert('Salvando', 'Aguarde um momento...');
    const response = await api.post('/auth/register', data);
    Alert.alert('Sucesso', 'Usuário registrado com sucesso.');
    return response.data;
  } catch (error) {
    Alert.alert('Erro', 'Ocorreu um erro ao registrar. Tente novamente.');
    throw error;
  }
};

export const loginUser = async (data: LoginData) => {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error) {
    Alert.alert('Erro', 'Ocorreu um erro ao fazer login. Verifique suas credenciais.');
    throw error;
  }
};

export const getTasks = async (token: string) => {
  try {
    const response = await api.get<any[]>('/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    // Alert.alert('Erro', 'Falha ao carregar tarefas.');
    throw error;
  }
};

export const createTask = async (data: Omit<Task, 'id'>, token: string) => {
  try {
    const response = await api.post('/tasks', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    Alert.alert('Erro', 'Falha ao criar tarefa.');
    throw error;
  }
};

export const updateTask = async (id: number, data: Omit<Task, 'id'>, token: any) => {
  try {
    const response = await api.patch(`/tasks/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    Alert.alert('Erro', 'Falha ao atualizar tarefa.');
    throw error;
  }
};

export const deleteTask = async (id: number, token: string) => {
  try {
    const response = await api.delete(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    Alert.alert('Erro', 'Falha ao deletar tarefa.');
    throw error;
  }
};

export const getTaskById = async (id: number, token: string) => {
  try {
    const response = await api.get<Task>(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    Alert.alert('Erro', 'Falha ao buscar tarefa.');
    throw error;
  }
};
