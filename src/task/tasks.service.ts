import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

/**
 * Module -> Controller -> Service -> Repository
 *
 * Module -> Hierin worden de imports geregeld
 * Controller -> Hierin worden de routes geregeld
 * Service -> Hierin wordt de business logic geregeld (je moet hier ook error handling doen, dus als hij niet gevonden wordt, moet je een error teruggeven)
 * Repository -> Hierin worden de database queries geregeld
 */
@Injectable()
export class TasksService {
  constructor(
    // TaskRepository moet altijd singular zijn (dus TaskRepository ipv TasksRepository)
    // Dit is omdat het een repository is voor 1 entity
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async createTask(taskDto: CreateTaskDto): Promise<any> {
    const task = this.taskRepository.create(taskDto);
    const newTask = await this.taskRepository.save(task);
    console.log(newTask);
    return newTask;
  }

  /**
   * Wordt (helaas) niet gebruikt
   * @param id
   */
  findOne(id: number): Promise<Task | null> {
    return this.taskRepository.findOneBy({ id });
  }

  /**
   * Wordt (helaas) niet gebruikt
   * @param id
   */
  async remove(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
