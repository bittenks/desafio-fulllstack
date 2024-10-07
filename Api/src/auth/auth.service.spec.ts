import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findByUsername: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('deve retornar o usuário se for válido', async () => {
      const user = {
        id: 1,
        username: 'bruno5',
        password: await bcrypt.hash('sua_senha2', 10),
      };

      mockUserService.findByUsername.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.validateUser('bruno5', 'sua_senha2');
      expect(result).toEqual({ id: user.id, username: user.username });
    });

    it('deve retornar UnauthorizedException se o usuário não for encontrado', async () => {
      mockUserService.findByUsername.mockResolvedValue(null);

      await expect(authService.validateUser('bruno5', 'sua_senha2')).rejects.toThrow(UnauthorizedException);
    });

    it('deve retornar UnauthorizedException se a senha estiver errada', async () => {
      const user: User = {
        id: 1,
        username: 'bruno5',
        password: await bcrypt.hash('sua_senha2', 10),
        tasks: [],
        assignedTasks: [],
      };

      mockUserService.findByUsername.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(authService.validateUser('bruno5', 'senha_errada')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('deve criar um usuário se não existir com o mesmo username', async () => {
      mockUserService.findByUsername.mockResolvedValue(null);
      const user = { id: 1, username: 'bruno5', password: 'hashed_password' };
      mockUserService.create.mockResolvedValue(user);

      const result = await authService.register('bruno5', 'sua_senha2');
      expect(result).toEqual(user);
      expect(mockUserService.create).toHaveBeenCalledWith('bruno5', expect.any(String));
    });

    it('deve dar ConflictException se já existir um username', async () => {
      mockUserService.findByUsername.mockResolvedValue({ id: 1, username: 'bruno5' });

      await expect(authService.register('bruno5', 'sua_senha2')).rejects.toThrow(ConflictException);
    });

    it('deve chamar a função de criar com senha hash', async () => {
      const user = { id: 1, username: 'bruno5', password: 'hashed_password' };
      mockUserService.findByUsername.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(user);
      const password = 'sua_senha2';

      const result = await authService.register('bruno5', password);


      expect(result.password).not.toEqual(password);
    });
  });

  describe('login', () => {
    it('deve retornar um access_token e informações do usuário', async () => {
      const user: User = {
        id: 1,
        username: 'bruno5',
        password: 'hashed_password',
        tasks: [], // Tarefas criadas pelo usuário
        assignedTasks: [], // Tarefas atribuídas ao usuário
      };

      const token = 'mocked.jwt.token';
      mockJwtService.sign.mockReturnValue(token);

      const result = await authService.login(user);

      expect(result).toEqual({
        id: user.id,
        username: user.username,
        createdTasks: user.tasks, // Tarefas que o usuário criou
        assignedTasks: user.assignedTasks, // Tarefas atribuídas ao usuário
        access_token: token,
      });

      expect(mockJwtService.sign).toHaveBeenCalledWith({ username: user.username, sub: user.id });
    });
  });


});
