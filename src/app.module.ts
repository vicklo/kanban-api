import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {SocketGateway} from './socket.gateway';
import { dataBaseConfig } from './database/database.config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './task/entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './task/tasks.service';
import { TaskModule } from './task/tasks.module';

@Module({
  imports: [  TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'kanban-frostup',
    entities: [Task],
    synchronize: true,
  }),TaskModule],
  controllers: [AppController],
  providers: [AppService, SocketGateway, TasksService],
})
export class AppModule {}
