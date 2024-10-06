import axios from 'axios';

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


const handleError = (error: any) => {
  console.error('Error occurred:', error);
  if (error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    console.error('Response headers:', error.response.headers);
  } else if (error.request) {
    console.error('Request made but no response received:', error.request);
  } else {
    console.error('Error message:', error.message);
  }
  throw error;
};

api.interceptors.response.use(
  response => response,
  error => {
    handleError(error);
    throw error;
  }
);


export const registerUser = async (data: RegisterData) => {
  try {
    if (!data.username || !data.password) {
      throw new Error('Username and password are required');
    }
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const loginUser = async (data: LoginData) => {
  try {
    if (!data.username || !data.password) {
      throw new Error('Username and password are required');
    }
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};


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

export const getUsers = async () => {
  try {
    const response = await axios.get('/users', {
      headers: {
        'Content-Type': 'application/json',
        // adicione mais headers se necessário
      },
    });
    console.log(response);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
  }
};
export const createTask = async (data: Omit<Task, 'id'>, token: string) => {
  try {
    const response = await api.post('/tasks', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateTask = async (id: number, data: Partial<Task>, token: string) => {
  try {
    const response = await api.patch(`/tasks/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteTask = async (id: number, token: string) => {
  try {
    await api.delete(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleError(error);
  }
};

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
