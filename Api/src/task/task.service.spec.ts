import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';

describe('TaskService', () => {
  let service: TaskService;
  let repository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository, // Usando um mock do Repository
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new task', async () => {
    const user: User = { id: 1, username: 'testuser', password: 'password', tasks: [], assignedTasks: [] };
    const descricao = 'Test Task';
    const responsavel: User = { id: 2, username: 'responsavel', password: 'password', tasks: [], assignedTasks: [] };

    const task: Task = { id: 1, descricao, status: 'pendente', usuario: user, responsavel };

    jest.spyOn(repository, 'create').mockReturnValue(task);
    jest.spyOn(repository, 'save').mockResolvedValue(task);

    expect(await service.createTask(descricao, user, responsavel)).toEqual(task);
    expect(repository.create).toHaveBeenCalledWith({ descricao, status: 'pendente', usuario: user, responsavel });
    expect(repository.save).toHaveBeenCalledWith(task);
  });

  it('should update task status', async () => {
    const user: User = { id: 1, username: 'testuser', password: 'password', tasks: [], assignedTasks: [] };
    const task: Task = { id: 1, descricao: 'Test Task', status: 'pendente', usuario: user, responsavel: null };

    jest.spyOn(repository, 'findOne').mockResolvedValue(task);
    jest.spyOn(repository, 'save').mockResolvedValue({ ...task, status: 'concluída' });

    const updatedTask = await service.updateTaskStatus(1, 'concluída', user);
    expect(updatedTask.status).toBe('concluída');
    expect(repository.save).toHaveBeenCalledWith({ ...task, status: 'concluída' });
  });

  it('should throw an error if task is not found or unauthorized', async () => {
    const user: User = { id: 1, username: 'testuser', password: 'password', tasks: [], assignedTasks: [] };

    jest.spyOn(repository, 'findOne').mockResolvedValue(null); // Não encontrou a tarefa

    await expect(service.updateTaskStatus(1, 'concluída', user)).rejects.toThrow('Task not found or unauthorized');
  });

  it('should get tasks by user', async () => {
    const user: User = { id: 1, username: 'testuser', password: 'password', tasks: [], assignedTasks: [] };
    const tasks: Task[] = [
      { id: 1, descricao: 'Task 1', status: 'pendente', usuario: user, responsavel: null },
      { id: 2, descricao: 'Task 2', status: 'pendente', usuario: user, responsavel: user },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(tasks);

    const result = await service.getTasksByUser(user);
    expect(result).toEqual(tasks);
    expect(repository.find).toHaveBeenCalledWith({ where: [{ usuario: user }, { responsavel: user }] });
  });
});
