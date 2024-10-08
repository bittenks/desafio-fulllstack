import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service'; // Ensure this import is correct

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepository: Repository<Task>;
  let userService: UserService;

  // Mock do repositório de tarefas
  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder), // Mock do Query Builder
  };

  // Mock do usuário
  const mockUser: User = {
    id: 1,
    username: 'bruno5',
    password: 'sua_senha2',
    tasks: [],
    assignedTasks: [],
  };

  // Usuário não autorizado mockado
  const unauthorizedUser: User = {
    id: 2,
    username: 'usuario_diferente',
    password: 'outra_senha',
    tasks: [],
    assignedTasks: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: UserService,
          useValue: {
            getUserById: jest.fn().mockResolvedValue(mockUser), // Mock UserService method
          },
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('deve criar uma nova tarefa', async () => {
      const title = 'Titulo Nova Tarefa';
      const descricao = 'Nova Tarefa';
      const status = 'Não Iniciada';
      const responsavelId = mockUser.id;

      const mockTask = { id: 1, title, descricao, status, usuario: mockUser, responsavel: mockUser };
      mockTaskRepository.create.mockReturnValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(mockTask);

      const result = await taskService.createTask(title, descricao, mockUser, responsavelId, status);
      expect(result).toEqual(mockTask);
      expect(mockTaskRepository.create).toHaveBeenCalledWith(expect.objectContaining({ descricao, status }));
      expect(mockTaskRepository.save).toHaveBeenCalledWith(mockTask);
    });

    it('deve lançar NotFoundException se o responsável não for encontrado', async () => {
      const title = 'Titulo Nova Tarefa';
      const descricao = 'Nova Tarefa';
      const status = 'Não Iniciada';
      const responsavelId = 999; // Id de um usuário que não existe

      jest.spyOn(userService, 'getUserById').mockRejectedValue(new NotFoundException('Responsável não encontrado'));

      await expect(taskService.createTask(title, descricao, mockUser, responsavelId, status)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTask', () => {
    it('deve deletar a tarefa', async () => {
      const taskId = 1;
      const existingTask = { id: taskId, usuario: mockUser };

      mockTaskRepository.findOne.mockResolvedValue(existingTask);
      mockTaskRepository.delete.mockResolvedValue(undefined);

      await taskService.deleteTask(taskId, mockUser);
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(taskId);
    });

    it('deve lançar BadRequestException se a tarefa não for encontrada', async () => {
      const taskId = 1;
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(taskService.deleteTask(taskId, mockUser)).rejects.toThrow(BadRequestException);
    });

    it('deve lançar BadRequestException se o usuário não estiver autorizado a deletar', async () => {
      const taskId = 1;
      const existingTask = { id: taskId, usuario: mockUser };

      mockTaskRepository.findOne.mockResolvedValue(existingTask);

      await expect(taskService.deleteTask(taskId, unauthorizedUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getTasksByUser', () => {
    it('deve retornar todas as tarefas do usuário', async () => {
      const tasks = [{ title: 'tarefa 1', id: 1, descricao: 'Tarefa 1', usuario: mockUser }];

      mockQueryBuilder.getMany.mockResolvedValue(tasks); // Mock do retorno das tarefas

      const result = await taskService.getTasksByUser(mockUser);
      expect(result).toEqual(tasks);
      expect(mockTaskRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('task.responsavel', 'responsavel'); // Verifique se o join foi chamado
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('task.usuarioId = :userId', { userId: mockUser.id }); // Verifique se a condição foi chamada
    });

    it('deve filtrar tarefas por status', async () => {
      const tasks = [{ title: 'Tarefa Filtrada', id: 1, descricao: 'Tarefa Filtrada', status: 'Em Andamento', usuario: mockUser }];

      mockQueryBuilder.getMany.mockResolvedValue(tasks); // Mock do retorno das tarefas

      const result = await taskService.getTasksByUser(mockUser, 'Em Andamento');
      expect(result).toEqual(tasks);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('task.status = :status', { status: 'Em Andamento' }); // Verifique se a filtragem por status foi chamada
    });
  });
});
