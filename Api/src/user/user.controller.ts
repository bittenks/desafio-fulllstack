import { Controller, Get, Param, Delete, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service'; 
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get() // Rota para obter todos os usuários
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers(); 
  }

  @Get(':id') // Rota para obter um usuário pelo ID
  async getUser(@Param('id') id: number): Promise<User> {
    return this.userService.getUserById(id); 
  }

  @Delete(':id') // Rota para deletar um usuário pelo ID
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
