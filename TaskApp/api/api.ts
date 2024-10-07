import axios from 'axios';
import Toast from 'react-native-toast-message';

// URL base da API
const api = axios.create({
  // baseURL: 'http://localhost:3000',
  baseURL: 'http://192.168.15.42:3000', // Seu IP local
});

// Interfaces para os dados
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
  responsavel: {
    username: string;
  };
}

// Função para tratar erros
const handleError = (error: any) => {
  console.error('Error occurred:', error);
  if (error.response) {
    Toast.show({
      type: 'error',
      text1: 'Erro',
      text2: error.response.data.message || 'Ocorreu um erro inesperado.',
      position: 'top',
    });
  } else if (error.request) {
    Toast.show({
      type: 'error',
      text1: 'Erro de Rede',
      text2: 'Nenhuma resposta recebida.',
      position: 'top',
    });
  } else {
    Toast.show({
      type: 'error',
      text1: 'Erro',
      text2: error.message,
      position: 'top',
    });
  }
  throw error;
};

// Interceptores para gerenciar a resposta
api.interceptors.response.use(
  response => response,
  error => {
    handleError(error);
    throw error;
  }
);

// Função para registrar um usuário
export const registerUser = async (data: RegisterData) => {
  try {
    if (!data.username || !data.password) {
      throw new Error('Username e senha são obrigatórios');
    }
    const response = await api.post('/auth/register', data);
    Toast.show({
      type: 'success',
      text1: 'Sucesso',
      text2: 'Usuário registrado com sucesso!',
      position: 'top',
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Função para login
export const loginUser = async (data: LoginData) => {
  try {
    if (!data.username || !data.password) {
      throw new Error('Username e senha são obrigatórios');
    }
    const response = await api.post('/auth/login', data);
    Toast.show({
      type: 'success',
      text1: 'Sucesso',
      text2: 'Login realizado com sucesso!',
      position: 'top',
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Função para obter tarefas
export const getTasks = async (token: string) => {
  try {
    const response = await api.get<Task[]>('/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Função para criar uma tarefa
export const createTask = async (data: Omit<Task, 'id'>, token: string) => {
  try {
    const response = await api.post('/tasks', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Toast.show({
      type: 'success',
      text1: 'Sucesso',
      text2: 'Tarefa criada com sucesso!',
      position: 'top',
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Função para atualizar uma tarefa
export const updateTask = async (id: number, data: Partial<Task>, token: string) => {
  try {
    const response = await api.patch(`/tasks/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Toast.show({
      type: 'success',
      text1: 'Sucesso',
      text2: 'Tarefa atualizada com sucesso!',
      position: 'top',
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Função para deletar uma tarefa
export const deleteTask = async (id: number, token: string) => {
  try {
    await api.delete(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Toast.show({
      type: 'success',
      text1: 'Sucesso',
      text2: 'Tarefa deletada com sucesso!',
      position: 'top',
    });
  } catch (error) {
    handleError(error);
  }
};

// Função para obter uma tarefa pelo ID
export const getTaskById = async (id: number, token: string) => {
  try {
    const response = await api.get<Task>(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

