import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('deve registrar um novo usuário', async () => {
      const user: User = { id: 1, username: 'bruno5', password: 'hashed_password', tasks: [], assignedTasks: [] };
      mockAuthService.register.mockResolvedValue(user);

      const result = await authController.register({ username: 'bruno5', password: 'sua_senha2' });
      expect(result).toEqual(user);
      expect(mockAuthService.register).toHaveBeenCalledWith('bruno5', 'sua_senha2');
    });

    it('deve lançar BadRequestException se username ou password não forem fornecidos', async () => {
      await expect(authController.register({ username: '', password: 'sua_senha2' })).rejects.toThrow(BadRequestException);
      await expect(authController.register({ username: 'bruno5', password: '' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('deve retornar um access_token', async () => {
      const user = { id: 1, username: 'bruno5', password: 'hashed_password', tasks: [], assignedTasks: [] };
      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockReturnValue({ access_token: 'mocked.jwt.token' });

      const result = await authController.login({ username: 'bruno5', password: 'sua_senha2' });
      expect(result).toEqual({ access_token: 'mocked.jwt.token' });
      expect(mockAuthService.validateUser).toHaveBeenCalledWith('bruno5', 'sua_senha2');
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });

    it('deve lançar BadRequestException se username ou password não forem fornecidos', async () => {
      await expect(authController.login({ username: '', password: 'sua_senha2' })).rejects.toThrow(BadRequestException);
      await expect(authController.login({ username: 'bruno5', password: '' })).rejects.toThrow(BadRequestException);
    });
  });
});
