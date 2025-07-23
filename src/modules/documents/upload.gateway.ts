import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import io from "socket.io"
import { Injectable } from '@nestjs/common';


@Injectable()
@WebSocketGateway({
  // cors: true,
  // origin: '*',
  cors: {
    origin: ['https://dms.easyaab.com', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
  namespace: 'upload-progress',
})
export class UploadGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;


  handleConnection(client: any) {
  }


  sendProgressUpdate(jobId: any, progress: number, status: boolean = false, message: string = "") {
    const eventChannel = `upload-progress-${jobId}`;
    console.log('eventChannel: ', eventChannel);
    try {
      this.server.emit(eventChannel, { jobId, progress, status, message });
    } catch (err) {
    }
  }
}
