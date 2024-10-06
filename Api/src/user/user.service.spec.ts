import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

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
    assignedTasks: []
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
        const username = 'bruno5';
        const password = 'sua_senha2';
        const hashedPassword = await bcrypt.hash(password, 10); 

        
        mockUserRepository.create.mockReturnValue({
            id: 1,
            username,
            password: hashedPassword, 
        });
        mockUserRepository.save.mockResolvedValue({
            id: 1,
            username,
            password: hashedPassword, 
        });

        const result = await userService.create(username, password);
        
        
        expect(result.username).toEqual(username);
        expect(result.id).toEqual(1);
        
        
        expect(mockUserRepository.create).toHaveBeenCalledWith({
            username,
            password: expect.any(String), 
        });
        
        expect(mockUserRepository.save).toHaveBeenCalledWith({
            id: 1,
            username,
            password: expect.any(String), 
        });
    });
});



  describe('findByUsername', () => {
    it('deve retornar um usuário se encontrado', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await userService.findByUsername('bruno5');
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { username: 'bruno5' } });
    });

    it('deve retornar null se o usuário não for encontrado', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await userService.findByUsername('usuario_inexistente');
      expect(result).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('deve retornar todos os usuários', async () => {
      mockUserRepository.find.mockResolvedValue([mockUser]);

      const result = await userService.getAllUsers();
      expect(result).toEqual([mockUser]);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('deve retornar um usuário se encontrado', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.getUserById(999)).rejects.toThrow(NotFoundException);
      await expect(userService.getUserById(999)).rejects.toThrow('Usuário não encontrado.');
    });
  });

  describe('deleteUser', () => {
    it('deve deletar um usuário se encontrado', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(undefined); 

      await userService.deleteUser(1);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.deleteUser(999)).rejects.toThrow(NotFoundException);
      await expect(userService.deleteUser(999)).rejects.toThrow('Usuário não encontrado.');
    });
  });
});
