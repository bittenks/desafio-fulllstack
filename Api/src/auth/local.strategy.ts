import { Injectable, UnauthorizedException } from '@nestjs/common'; // Adicione a importação aqui
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException(); // Agora deve funcionar
    }
    return user; // Retorna o usuário se as credenciais forem válidas
  }
}
