import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TasksService } from './task/tasks.service';
import { Task } from './task/entities/task.entity';
import { Logger, OnModuleInit } from '@nestjs/common';

@WebSocketGateway({ cors: true })
// Voor alle acties zijn er interfaces die je kan implementeren
export class SocketGateway
  implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private tasks: Task[] = [];

  constructor(private readonly taskService: TasksService) {}

  /**
   * Eerst werd dit gedaan in handleConnection,
   * maar aangezien je daarna nooit meer deed inladen kan je dit beter hier doen
   * Dit is een lifecycle hook, die wordt uitgevoerd wanneer de module wordt geïnitialiseerd
   */
  async onModuleInit() {
    Logger.log('Loading data', SocketGateway.name);
    this.tasks = await this.taskService.findAll();
    Logger.log(
      'Data loaded, found ' + this.tasks.length + ' tasks',
      SocketGateway.name,
    );
  }

  /**
   * Op het moment dat een client connecteert, wordt deze functie uitgevoerd
   * @param client
   */
  async handleConnection(client: Socket) {
    client.emit('onconnect', this.tasks);
  }

  handleDisconnect(client: Socket) {
    // Handle disconnection event
    Logger.log('Client disconnected ' + client.id, SocketGateway.name);
  }

  @SubscribeMessage('update')
  async handleMessage(
    @MessageBody() data: Task,
    @ConnectedSocket() client: Socket,
  ) {
    // Wanneer data.id 0 is, dan is het een nieuwe taak
    // Je zou hier ook een aparte functie voor kunnen maken (separation of concerns, single responsibility principle)
    // Dit is een goede gewoonte, omdat je dan niet te veel code in 1 functie hebt

    if (data.id === 0) {
      const newTask = await this.taskService.createTask(data);
      // Maak een nieuwe array met de nieuwe taak toegevoegd, in plaats van pushen naar de bestaande array
      // (dit is een goede gewoonte, omdat je dan geen referentie naar de oude array hebt)
      this.tasks = [...this.tasks, newTask];
      this.server.emit('update', newTask);
    } else {
      // Gebruik de map functie om een nieuwe array te maken, waarbij het gematchte item wordt aangepast
      // (dit is een goede gewoonte, omdat je dan geen referentie naar de oude array hebt)
      this.tasks = this.tasks.map((x) => (x.id === data.id ? data : x));
      this.server.emit('update', data);
    }
  }
}
