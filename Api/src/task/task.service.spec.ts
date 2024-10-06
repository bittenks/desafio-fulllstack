import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepository: Repository<Task>;

  // Mock do repositório de tarefas
  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  // Mock do usuário
  const mockUser: User = { 
    id: 1, 
    username: 'bruno5', 
    password: 'sua_senha2', 
    tasks: [], // Adicionando tarefas vazias
    assignedTasks: [] // Adicionando tarefas atribuídas vazias
  };

  // Usuário não autorizado mockado
  const unauthorizedUser: User = { 
    id: 2, 
    username: 'usuario_diferente', 
    password: 'outra_senha', // Necessário para satisfazer o tipo User
    tasks: [],
    assignedTasks: []
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateTask', () => {
    it('deve atualizar a tarefa', async () => {
      const taskId = 1;
      const updateData = { descricao: 'Tarefa Atualizada' };
      const existingTask = { id: taskId, usuario: mockUser, ...updateData };
      mockTaskRepository.findOne.mockResolvedValue(existingTask);
      mockTaskRepository.save.mockResolvedValue(existingTask);

      const result = await taskService.updateTask(taskId, updateData, mockUser);
      expect(result).toEqual(existingTask);
      expect(mockTaskRepository.save).toHaveBeenCalledWith(expect.objectContaining(updateData));
    });

    it('deve lançar BadRequestException se a tarefa não for encontrada', async () => {
      const taskId = 1;
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(taskService.updateTask(taskId, {}, mockUser)).rejects.toThrow(BadRequestException);
    });

    it('deve lançar BadRequestException se o usuário não estiver autorizado', async () => {
      const taskId = 1;
      const existingTask = { id: taskId, usuario: mockUser };
      mockTaskRepository.findOne.mockResolvedValue(existingTask);

      await expect(taskService.updateTask(taskId, {}, unauthorizedUser)).rejects.toThrow(BadRequestException);
    });
  });
});
