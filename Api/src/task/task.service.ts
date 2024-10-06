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
  ) { }

  // Método para criar uma nova tarefa
  async createTask(descricao: string, usuario: User, responsavel: string, status: string): Promise<Task> {
    const task = this.taskRepository.create({
      descricao,
      status: status ? status : "Não Iniciada",
      usuario,
      responsavel,
    });

    return this.taskRepository.save(task); // Salva a nova tarefa no banco de dados
  }

  // Método para atualizar uma tarefa
  async updateTask(id: number, updateData: Partial<Task>, usuario: User): Promise<Task> {
    try {
      // Busca a tarefa com o usuário associado
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

      Object.assign(task, updateData); // Atualiza os campos da tarefa
      return await this.taskRepository.save(task); // Salva as alterações
    } catch (error) {
      console.error('Erro ao atualizar a tarefa:', error);
      throw new BadRequestException('Erro ao atualizar a tarefa.'); // Mensagem genérica
    }
  }

  // Método para deletar uma tarefa
  async deleteTask(id: number, usuario: User): Promise<void> {
    // Busca a tarefa com o usuário associado
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['usuario'], // Carrega o usuário associado
    });

    if (!task) {
      throw new BadRequestException('Tarefa não encontrada.');
    }

    // Verifica se o usuário que está tentando deletar é o mesmo que criou a tarefa
    if (!task.usuario || task.usuario.id !== usuario.id) {
      throw new BadRequestException('Você não tem permissão para deletar esta tarefa.');
    }

    await this.taskRepository.delete(id); // Deleta a tarefa do banco de dados
  }

  // Método para obter tarefas do usuário, com possibilidade de filtrar por status
  async getTasksByUser(usuario: User, status?: string): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task')
      .where('task.usuarioId = :userId', { userId: usuario.id });

    if (status) {
      query.andWhere('task.status = :status', { status }); // Filtra tarefas pelo status se fornecido
    }

    return query.getMany(); // Retorna todas as tarefas encontradas
  }

  // Método para obter uma tarefa específica pelo ID
  async getTaskById(id: number, usuario: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id }, relations: ['usuario'] });

    if (!task || task.usuario.id !== usuario.id) {
      throw new BadRequestException('Tarefa não encontrada ou você não tem permissão para visualizá-la.');
    }

    return task; // Retorna a tarefa encontrada
  }
}
