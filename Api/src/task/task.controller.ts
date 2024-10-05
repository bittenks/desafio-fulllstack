import { Controller, Post, Patch, Delete, Get, Param, Body, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../user/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard('jwt')) // Protege todas as rotas com JWT
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // Rota para criar uma tarefa
  @Post()
  async createTask(
    @Body() body: { descricao: string; responsavel: string },
    @GetUser() usuario: User,
  ): Promise<Task> {
    return this.taskService.createTask(body.descricao, usuario, body.responsavel);
  }

  // Rota para atualizar uma tarefa
  @Patch(':id')
  async updateTask(
    @Param('id') id: number,
    @Body() body: Partial<Task>,
    @GetUser() usuario: User,
  ): Promise<Task> {
    return this.taskService.updateTask(id, body, usuario);
  }

  // Rota para deletar uma tarefa
  @Delete(':id')
  async deleteTask(@Param('id') id: number, @GetUser() usuario: User): Promise<void> {
    return this.taskService.deleteTask(id, usuario);
  }

  // Rota para obter todas as tarefas do usuário autenticado
  @Get()
  async getTasksByUser(@GetUser() usuario: User): Promise<Task[]> {
    return this.taskService.getTasksByUser(usuario);
  }

  // Rota para obter uma tarefa específica pelo ID
  @Get(':id')
  async getTaskById(@Param('id') id: number, @GetUser() usuario: User): Promise<Task> {
    return this.taskService.getTaskById(id, usuario);
  }
}
