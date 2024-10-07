import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    deleteUser: jest.fn(),
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
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('deve retornar todos os usuários', async () => {
      const users = [mockUser];
      mockUserService.getAllUsers.mockResolvedValue(users);

      const result = await userController.getAllUsers();
      expect(result).toEqual(users);
    });
  });

  describe('getUser', () => {
    it('deve retornar um usuário pelo ID', async () => {
      mockUserService.getUserById.mockResolvedValue(mockUser);

      const result = await userController.getUser(1);
      expect(result).toEqual(mockUser);
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      mockUserService.getUserById.mockResolvedValue(null);

      await expect(userController.getUser(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('deve deletar um usuário pelo ID', async () => {
      mockUserService.deleteUser.mockResolvedValue(undefined);

      await userController.deleteUser(1);
      expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
    });
  });
});
