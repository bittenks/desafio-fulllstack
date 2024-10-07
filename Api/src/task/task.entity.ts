import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  descricao: string;
  @Column()
  status: string;

  @ManyToOne(() => User, user => user.tasks, { eager: false }) // Usuário que criou a tarefa
  usuario: User;

  @ManyToOne(() => User, user => user.assignedTasks, { eager: false }) // Usuário responsável pela tarefa
  responsavel: User;
}
