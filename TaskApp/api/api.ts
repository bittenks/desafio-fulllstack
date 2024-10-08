import axios from 'axios';
import Toast from 'react-native-toast-message';

// URL base da API
const api = axios.create({
  // baseURL: 'http://x:3000', // Seu IP local
  baseURL: 'https://desafio-fulllstack.onrender.com', // Seu IP local

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
  title: string;
  descricao: string;
  status: string;
  responsavel?: any;
}

interface User { // Interface para usuário
  id: number;
  username: string;
}

// Função para tratar erros
const handleError = (error: any) => {
  let message = 'Ocorreu um erro inesperado.';

  if (error.response) {
    message = error.response.data.message || message;
    showToast('error', 'Erro', message);
  } else if (error.request) {
    showToast('error', 'Erro de Rede', 'Nenhuma resposta recebida.');
  } else {
    showToast('error', 'Erro', error.message);
  }

  throw error; // Propaga o erro para quem chamou
};

// Função auxiliar para exibir Toasts
const showToast = (type: 'success' | 'error', text1: string, text2: string) => {
  Toast.show({
    type,
    text1,
    text2,
    position: 'top',
  });
};

// Interceptores para gerenciar a resposta
api.interceptors.response.use(
  response => response,
  error => {
    handleError(error);
    return Promise.reject(error); // Certifique-se de que o erro seja tratado em outro lugar se necessário
  }
);

// Função para registrar um usuário
export const registerUser = async (data: RegisterData) => {
  try {
    if (!data.username || !data.password) {
      throw new Error('Username e senha são obrigatórios');
    }
    const response = await api.post('/auth/register', data);
    showToast('success', 'Sucesso', 'Usuário registrado com sucesso!');
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
    showToast('success', 'Sucesso', 'Login realizado com sucesso!');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Função para obter tarefas
export const getTasks = async (token: string): Promise<any[]> => {
  try {
    const response = await api.get<Task[]>('/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return [];
  }
};

// Função para criar uma tarefa
export const createTask = async (data: Omit<Task, 'id'>, token: string) => {
  try {
    const response = await api.post('/tasks', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    showToast('success', 'Sucesso', 'Tarefa criada com sucesso!');
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
    showToast('success', 'Sucesso', 'Tarefa atualizada com sucesso!');
    return response.data;
  } catch (error) {
    throw new Error('Você não tem permissão para editar esta tarefa.'); 
  }
};

// Função para deletar uma tarefa
export const deleteTask = async (id: number, token: string) => {
  try {
    await api.delete(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    showToast('success', 'Sucesso', 'Tarefa deletada com sucesso!');
  } catch (error) {
    throw new Error('Você não tem permissão para deletar esta tarefa.'); // Propaga o erro

  }
};


// Função para obter uma tarefa específica pelo ID
export const getTaskById = async (id: number, token: string): Promise<any[]> => {
  // Validação do ID
  if (!id || id <= 0) {
    throw new Error('ID inválido fornecido.');
  }
  try {
    const response = await api.get(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao carregar dados da tarefa:', error);
    handleError(error);
    throw new Error('Falha ao carregar os dados.'); // Propaga o erro
  }
};


// Função para obter a lista de usuários
export const getUsers = async () => {
  try {
    const response = await api.get<User[]>('/users')
    return response.data; // Retorna a lista de usuários
  } catch (error) {
    handleError(error);
  }
};
