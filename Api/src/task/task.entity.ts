import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descricao: string;

  @Column()
  status: string; // Pode ser 'pendente', 'em progresso', 'concluída'

  @ManyToOne(() => User, (user) => user.tasks)
  usuario: User;

  @Column() 
  responsavel: string;
}
