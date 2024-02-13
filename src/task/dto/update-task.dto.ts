import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

/**
 * Mooi dat je DTO's gebruikt om data te valideren.
 * Alleen jammer dat je deze niet gebruikt in je service. :)
 * Maar zal waarshijnlijk komen omdat je niet aan de update functie bent toegekomen.
 */
export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  id: number;
}
