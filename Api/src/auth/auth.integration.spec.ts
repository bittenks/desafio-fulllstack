import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
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
    it('should return user if credentials are valid', async () => {
      const user: User = {
        id: 1,
        username: 'bruno5',
        password: await bcrypt.hash('sua_senha2', 10),
        tasks: [],           // Propriedades adicionais
        assignedTasks: [],   // Propriedades adicionais
      };

      mockUserService.findByUsername.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser('bruno5', 'sua_senha2');
      expect(result).toEqual({ id: 1, username: 'bruno5' });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUserService.findByUsername.mockResolvedValue(null);

      await expect(service.validateUser('bruno5', 'sua_senha2')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const user: User = {
        id: 1,
        username: 'bruno5',
        password: await bcrypt.hash('sua_senha2', 10),
        tasks: [],           // Propriedades adicionais
        assignedTasks: [],   // Propriedades adicionais
      };

      mockUserService.findByUsername.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.validateUser('bruno5', 'senha_errada')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create a new user if username does not exist', async () => {
      mockUserService.findByUsername.mockResolvedValue(null);

      const hashedPassword = await bcrypt.hash('sua_senha2', 10);
      const newUser: User = {
        id: 1,
        username: 'bruno5',
        password: hashedPassword,
        tasks: [],           // Propriedades adicionais
        assignedTasks: [],   // Propriedades adicionais
      };

      mockUserService.create.mockResolvedValue(newUser);

      const result = await service.register('bruno5', 'sua_senha2');
      expect(result).toEqual(newUser);
    });

    it('should throw ConflictException if username already exists', async () => {
      mockUserService.findByUsername.mockResolvedValue({ id: 1, username: 'bruno5' });

      await expect(service.register('bruno5', 'sua_senha2')).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const user: User = {
        id: 1,
        username: 'bruno5',
        password: 'sua_senha2',
        tasks: [],           // Propriedades adicionais
        assignedTasks: [],   // Propriedades adicionais
      };

      const token = 'mocked.jwt.token';
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.login(user);
      expect(result).toEqual({ access_token: token });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ username: user.username, sub: user.id });
    });
  });
});
