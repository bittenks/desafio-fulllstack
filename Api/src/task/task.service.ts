import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private userService: UserService,
  ) { }

  // Método para criar uma nova tarefa
  async createTask(title: string, descricao: string, usuario: User, responsavelId: number, status: string): Promise<Task> {
    const responsavel = await this.userService.getUserById(responsavelId);
    if (!responsavel) {
      throw new NotFoundException('Usuário responsável não encontrado.');
    }

    const task = this.taskRepository.create({
      title,
      descricao,
      status: status ? status : "Não Iniciada",
      usuario,
      responsavel,
    });

    return this.taskRepository.save(task);
  }

  // Método para atualizar uma tarefa
  async updateTask(id: number, updateData: Partial<Task>, usuario: User): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['usuario', 'responsavel'],
      });

      if (!task) {
        throw new BadRequestException('Tarefa não encontrada.');
      }

      if (!task.usuario || task.usuario.id !== usuario.id) {
        throw new BadRequestException('Você não tem permissão para editar esta tarefa.');
      }

      Object.assign(task, updateData);
      return await this.taskRepository.save(task);
    } catch (error) {
      console.error('Erro ao atualizar a tarefa:', error);
      throw new BadRequestException('Erro ao atualizar a tarefa.');
    }
  }

  // Método para deletar uma tarefa
  async deleteTask(id: number, usuario: User): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!task) {
      throw new BadRequestException('Tarefa não encontrada.');
    }

    if (!task.usuario || task.usuario.id !== usuario.id) {
      throw new BadRequestException('Você não tem permissão para deletar esta tarefa.');
    }

    await this.taskRepository.delete(id);
  }

  // Método para obter tarefas do usuário, com possibilidade de filtrar por status
  async getTasksByUser(usuario: User, status?: string): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.responsavel', 'responsavel')
      .leftJoinAndSelect('task.usuario', 'usuario')
      .where('task.usuarioId = :userId OR task.responsavelId = :userId', { userId: usuario.id }); // Filtra pelo usuário ou responsável

    if (status) {
      query.andWhere('task.status = :status', { status }); // Filtra por status se fornecido
    }

    try {
      return await query.getMany();
    } catch (error) {
      console.error('Error retrieving tasks:', error);
      throw new Error('Error retrieving tasks');
    }
  }


  async getTaskById(id: number, usuario: User): Promise<Task> {
    if (!id || id <= 0) {
      throw new BadRequestException('ID inválido fornecido.');
    }

    try {
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['usuario', 'responsavel'], // Carrega os usuários associados
      });

      if (!task) {
        throw new BadRequestException('Tarefa não encontrada.');
      }

      console.log('Tarefa encontrada:', task);
      console.log('ID do usuário:', usuario.id);
      console.log('ID do responsável:', task.responsavel?.id);
      console.log('retornando task');

      if (task.usuario.id !== usuario.id && task.responsavel?.id !== usuario.id) {
        throw new BadRequestException('Você não tem permissão para visualizar esta tarefa.');
      }
      console.log('retornando task');

      return task;
    } catch (error) {
      console.error('Erro ao carregar dados da tarefa:', error);
      throw new BadRequestException('Falha ao carregar os dados.'); // Re-throwing the error
    }
  }
}
