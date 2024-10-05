import { Controller, Get, Param, Delete, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service'; // Ajuste o caminho conforme necessário
import { User } from './user.entity'; // Ajuste o caminho conforme necessário

@Controller('users') // Use 'users' como plural para a rota
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get() // Rota para obter todos os usuários
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers(); // Chama o método do serviço
  }

  @Get(':id') // Rota para obter um usuário pelo ID
  async getUser(@Param('id') id: number): Promise<User> {
    return this.userService.getUserById(id); // Chama o método do serviço
  }

  @Delete(':id') // Rota para deletar um usuário pelo ID
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
