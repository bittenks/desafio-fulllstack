import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from '../task/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Task, task => task.usuario, { eager: true })
  tasks: Task[];

  @OneToMany(() => Task, task => task.responsavel, { eager: true })
  assignedTasks: Task[];
}
