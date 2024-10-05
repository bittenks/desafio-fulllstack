import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../user/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createTask(descricao: string, usuario: User, responsavel: string): Promise<Task> {
    const task = this.taskRepository.create({
      descricao,
      status: 'pendente',
      usuario,
      responsavel, // Agora é uma string
    });

    return this.taskRepository.save(task);
  }
  async updateTask(id: number, updateData: Partial<Task>, usuario: User): Promise<Task> {
    try {
      // Buscando a tarefa com o usuário associado
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['usuario'], // Carrega o usuário associado
      });
  
      if (!task) {
        throw new BadRequestException('Tarefa não encontrada.');
      }
  
      // Verifica se o usuário que está tentando editar é o mesmo que criou a tarefa
      if (!task.usuario || task.usuario.id !== usuario.id) {
        throw new BadRequestException('Você não tem permissão para editar esta tarefa.');
      }
  
      Object.assign(task, updateData);
      return await this.taskRepository.save(task);
    } catch (error) {
      console.error('Erro ao atualizar a tarefa:', error);
      throw new BadRequestException('Erro ao atualizar a tarefa.'); // Mensagem genérica para evitar vazamento de detalhes
    }
  }
  
  async deleteTask(id: number, usuario: User): Promise<void> {
    // Buscar a tarefa com o usuário associado
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['usuario'], // Carregar o usuário associado
    });
  
    if (!task) {
      throw new BadRequestException('Tarefa não encontrada.');
    }
  
    // Verifica se o usuário que está tentando deletar é o mesmo que criou a tarefa
    if (!task.usuario || task.usuario.id !== usuario.id) {
      throw new BadRequestException('Você não tem permissão para deletar esta tarefa.');
    }
  
    await this.taskRepository.delete(id); // Deletar a tarefa
  }
  
  

  async getTasksByUser(usuario: User, status?: string): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task')
      .where('task.usuarioId = :userId', { userId: usuario.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    return query.getMany();
  }

  async getTaskById(id: number, usuario: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task || task.usuario.id !== usuario.id) {
      throw new BadRequestException('Tarefa não encontrada ou você não tem permissão para visualizá-la.');
    }

    return task;
  }
}
