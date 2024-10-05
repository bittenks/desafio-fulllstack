import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository, // Mock do repositório TypeORM
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user with a hashed password', async () => {
    const username = 'testuser';
    const password = 'password123';

    // Simula o hash do bcrypt
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: User = {
      id: 1,
      username,
      password: hashedPassword,
      tasks: [],
      assignedTasks: [],
    };

    jest.spyOn(bcrypt, 'genSalt').mockResolvedValue(salt);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
    jest.spyOn(repository, 'create').mockReturnValue(user);
    jest.spyOn(repository, 'save').mockResolvedValue(user);

    const result = await service.create(username, password);

    expect(result).toEqual(user);
    expect(bcrypt.genSalt).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
    expect(repository.create).toHaveBeenCalledWith({ username, password: hashedPassword });
    expect(repository.save).toHaveBeenCalledWith(user);
  });

  it('should find a user by username', async () => {
    const username = 'testuser';
    const user: User = {
      id: 1,
      username,
      password: 'hashedPassword',
      tasks: [],
      assignedTasks: [],
    };

    jest.spyOn(repository, 'findOne').mockResolvedValue(user);

    const result = await service.findByUsername(username);

    expect(result).toEqual(user);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { username } });
  });
});
