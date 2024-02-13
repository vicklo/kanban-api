import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { Task } from './task/entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './task/tasks.service';
import { TaskModule } from './task/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'kanban-frostup',
      entities: [Task],
      synchronize: true,
    }),
    TaskModule,
  ],
  providers: [SocketGateway, TasksService],
})
export class AppModule {}
