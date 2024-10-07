import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register') // Rota para registrar um novo usuário
  async register(@Body() body: { username: string; password: string }): Promise<User> {
    if (!body.username || !body.password) {
      throw new BadRequestException('Username and password are required');
    }
    return this.authService.register(body.username, body.password);
  }

  @Post('login') // Rota para fazer login
  async login(@Body() body: { username: string; password: string }): Promise<{ access_token: string }> {
    if (!body.username || !body.password) {
      throw new BadRequestException('Username and password are required');
    }

    const user = await this.authService.validateUser(body.username, body.password);

    // O método login já retorna o objeto com o access_token
    return this.authService.login(user);
  }
}
