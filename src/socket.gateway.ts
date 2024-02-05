
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateTaskDto } from './task/dto/create-task.dto';
import { TasksService } from './task/tasks.service';
import { Task } from './task/entities/task.entity';

@WebSocketGateway({ cors: true })
export class SocketGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly taskservice: TasksService){}
  private loadeddata = false
  private tasks:Task[] = [];

  async handleConnection(client: any) {
    if(!this.loadeddata)
    {
      console.log("Loading data")
      this.tasks = await this.taskservice.findAll()
      this.loadeddata = true;
      console.log('found ' + this.tasks.length + ' taks')
    }
    client.emit('onconnect',this.tasks)
  }
  
  handleDisconnect(client: any) {
    // Handle disconnection event
    console.log('disconnect')
  }

  @SubscribeMessage('update')
  async handleMessage(@MessageBody() data: Task, @ConnectedSocket() client: Socket) {
    if(data.id === 0)
    {
      const newtask = await this.taskservice.createTask(data)
      this.tasks.push(newtask);
      this.server.emit('update',newtask)
      
    }
    else
    {
      const newList = []
      this.tasks.forEach(x =>
        {
          if(x.id === data.id)
          {
            newList.push(data)
          }
          else {newList.push(x)}
        })
      this.tasks = newList;
      this.server.emit('update', data);
    }
    
  }
}