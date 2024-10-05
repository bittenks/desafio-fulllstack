import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') // Rota para registrar um novo usuário
  async register(@Body() body: { username: string; password: string }): Promise<User> {
    return this.authService.register(body.username, body.password);
  }

  @Post('login') // Rota para fazer login
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    return this.authService.login(user);
  }
}
