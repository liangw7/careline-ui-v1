import { Observable } from "rxjs";

export class ChatService {
  private socket: any;

  sendMessage(message: any) {
    console.log('--chatService--sendMessage--start--');
    this.socket.emit('add-message', message);
  }

  getMessages() {
    console.log('--chatService--getMessages--start--');
    let observable = new Observable(observer => {
      //this.socket = io(this.url);
      this.socket.on('message', (data: unknown) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnecat();
      };
    })
    return observable;
  }
}