import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { User } from '../user/user.entity';
import { Task } from './task.entity';

describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: TaskService;

  const mockTaskService = {
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    getTasksByUser: jest.fn(),
    getTaskById: jest.fn(),
  };

  const mockUser: User = {
    id: 1,
    username: 'bruno5',
    password: 'sua_senha2',
    tasks: [],
    assignedTasks: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('deve criar uma nova tarefa', async () => {
      const mockTask: Task = { id: 1, descricao: 'Nova Tarefa', status: 'Não Iniciada', usuario: mockUser, responsavel: mockUser };
      mockTaskService.createTask.mockResolvedValue(mockTask);

      const body = { descricao: 'Nova Tarefa', responsavel: 1, status: 'Não Iniciada' };
      const result = await taskController.createTask(body, mockUser);
      expect(result).toEqual(mockTask);
      expect(mockTaskService.createTask).toHaveBeenCalledWith(body.descricao, mockUser, body.responsavel, body.status);
    });
  });

  describe('getTasksByUser', () => {
    it('deve retornar todas as tarefas do usuário', async () => {
      const tasks = [{ id: 1, descricao: 'Tarefa 1', usuario: mockUser }];
      mockTaskService.getTasksByUser.mockResolvedValue(tasks);

      const result = await taskController.getTasksByUser(mockUser);
      expect(result).toEqual(tasks);
      expect(mockTaskService.getTasksByUser).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('deleteTask', () => {
    it('deve deletar uma tarefa', async () => {
      const taskId = 1;
      await taskController.deleteTask(taskId, mockUser);
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(taskId, mockUser);
    });
  });
});
