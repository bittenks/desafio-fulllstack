import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser: User = {
    id: 1,
    username: 'bruno5',
    password: 'hashed_password',
    tasks: [],
    assignedTasks: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um novo usuário', async () => {
      mockUserRepository.findOne.mockResolvedValue(null); // Nenhum usuário existente
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await userService.create('bruno5', 'senha123');
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({ username: 'bruno5' }));
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('deve lançar ConflictException se o usuário já existir', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser); // Usuário já existente

      await expect(userService.create('bruno5', 'senha123')).rejects.toThrow(ConflictException);
    });
  });

  describe('getUserById', () => {
    it('deve retornar um usuário pelo ID', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);
      expect(result).toEqual(mockUser);
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.getUserById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('deve deletar um usuário existente', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(undefined);

      await userService.deleteUser(mockUser.id);
      expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.deleteUser(999)).rejects.toThrow(NotFoundException);
    });
  });
});
