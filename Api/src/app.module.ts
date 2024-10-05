import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller'; 
import { User } from './user/user.entity';
import { Task } from './task/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'users.db',
      entities: [User, Task],
      synchronize: true,
    }),
    UserModule,
    TaskModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
