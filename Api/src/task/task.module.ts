import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { TaskController } from './task.controller';
import { UserModule } from '../user/user.module'; // Importando UserModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    UserModule,
  ],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule { }
