
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';


@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private TasksRepository: Repository<Task>,
  ) {}

  findAll(): Promise<Task[]> {
    return this.TasksRepository.find();
  }

  async createTask(taskDto: CreateTaskDto):Promise<any> {
    const task = this.TasksRepository.create(taskDto);
    const newtask = await this.TasksRepository.save(task);
    console.log(newtask);
    return newtask
  }

  findOne(id: number): Promise<Task | null> {
    return this.TasksRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.TasksRepository.delete(id);
  }
}
