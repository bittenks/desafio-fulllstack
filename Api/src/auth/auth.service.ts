import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  // Validação de credenciais do usuário
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Credenciais inválidas');
  }

  // Registro de um novo usuário
  async register(username: string, password: string): Promise<User> {
    const existingUser = await this.userService.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('Nome de usuário já existe');
    }

    return this.userService.create(username, password);
  }

  // Login do usuário e geração do token JWT
  async login(user: User) {
    // Payload do token contendo informações básicas do usuário
    const payload = { username: user.username, sub: user.id };

    // Incluindo informações sobre o usuário no token
    return {
      id: user.id,
      username: user.username,
      createdTasks: user.tasks, // Tarefas criadas pelo usuário
      assignedTasks: user.assignedTasks, // Tarefas atribuídas ao usuário
      access_token: this.jwtService.sign(payload),
    };
  }
}
