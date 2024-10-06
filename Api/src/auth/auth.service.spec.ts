import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service'; // Certifique-se de que o caminho esteja correto
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
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

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('deve retornar o usuario se for valido', async () => {
      const user = {
        id: 1,
        username: 'bruno5',
        password: await bcrypt.hash('sua_senha2', 10),
      };

      mockUserService.findByUsername.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser('bruno5', 'sua_senha2');
      expect(result).toEqual({ id: 1, username: 'bruno5' });
    });

    it('deve retornar UnauthorizedException se usuario nao encontrado', async () => {
      mockUserService.findByUsername.mockResolvedValue(null);

      await expect(service.validateUser('bruno5', 'sua_senha2')).rejects.toThrow(UnauthorizedException);
    });

    it('deve retornar UnauthorizedException se a senha estiver errada ', async () => {
      const user: User = {
        id: 1,
        username: 'bruno5',
        password: await bcrypt.hash('sua_senha2', 10),
        tasks: [],
        assignedTasks: [],
      };

      mockUserService.findByUsername.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.validateUser('bruno5', 'senha_errada')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('deve criar um usuario se não existe com o mesmo username', async () => {
      mockUserService.findByUsername.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue({ id: 1, username: 'bruno5', password: 'hashed_password' });

      const result = await service.register('bruno5', 'sua_senha2');
      expect(result).toEqual({ id: 1, username: 'bruno5', password: 'hashed_password' });
    });

    it('deve dar ConflictException se ja existe um username', async () => {
      mockUserService.findByUsername.mockResolvedValue({ id: 1, username: 'bruno5' });

      await expect(service.register('bruno5', 'sua_senha2')).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('deve retornar a JWT token', async () => {
      const user: User = {
        id: 1,
        username: 'bruno5',
        password: 'sua_senha2',
        tasks: [],
        assignedTasks: [],
      };

      const token = 'mocked.jwt.token';
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.login(user);
      expect(result).toEqual({ access_token: token });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ username: user.username, sub: user.id });
    });
  });
});
