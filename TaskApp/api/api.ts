import axios from 'axios';
import Toast from 'react-native-toast-message';

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
    Toast.show({
      type: 'info',
      text1: 'Salvando',
      text2: 'Aguarde um momento...',
      position: 'top',
    });


    const response = await api.post('/auth/register', data);

    Toast.show({
      type: 'success',
      text1: 'Sucesso',
      text2: 'Usuário registrado com sucesso.',
      position: 'top',
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Erro! Ocorreu um erro ao registrar.',
      text2: ' Tente novamente com um nome de usuário diferente.',

      position: 'bottom',
    });
    throw error;
  }
};

export const loginUser = async (data: LoginData) => {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Erro',
      text2: 'Ocorreu um erro ao fazer login. Verifique suas credenciais.',
      position: 'top',
    });
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
    throw error;
  }
};

export const createTask = async (data: Omit<Task, 'id'>, token: string) => {
  try {
    const response = await api.post('/tasks', data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Toast.show({
      type: 'success',
      text1: 'Sucesso',
      text2: 'Tarefa criada com sucesso.',
      position: 'top',
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Erro',
      text2: 'Falha ao criar tarefa.',
      position: 'top',
    });
    throw error;
  }
};

export const updateTask = async (id: number, data: Omit<any, 'id'>, token: any) => {
  try {
    const response = await api.patch(`/tasks/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Toast.show({
      type: 'success',
      text1: 'Sucesso',
      text2: 'Tarefa atualizada com sucesso.',
      position: 'top',
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Erro',
      text2: 'Falha ao atualizar tarefa.',
      position: 'top',
    });
    throw error;
  }
};

export const deleteTask = async (id: number, token: string) => {
  try {
    const response = await api.delete(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Toast.show({
      type: 'success',
      text1: 'Sucesso',
      text2: 'Tarefa deletada com sucesso.',
      position: 'top',
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Erro',
      text2: 'Falha ao deletar tarefa.',
      position: 'top',
    });
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
    Toast.show({
      type: 'error',
      text1: 'Erro',
      text2: 'Falha ao buscar tarefa.',
      position: 'top',
    });
    throw error;
  }
};
