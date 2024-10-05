import { Controller, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service'; // Ajuste o caminho conforme necessário

@Controller('users') // Use 'users' como plural para a rota
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete(':id') // Rota para deletar um usuário pelo ID
  @HttpCode(HttpStatus.NO_CONTENT) // Define o status 204 para sucesso sem conteúdo
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser(id); // Chama o método de deletar do serviço
  }
}
