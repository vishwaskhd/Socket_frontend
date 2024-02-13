import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'enviroment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SocketioService {
    socket: any;
    constructor() { this.socket = io(environment.SOCKET_URL) }
    // setupSocketConnection() {
    //   this.socket = io(environment.SOCKET_ENDPOINT);
    //   this.socket.emit('my message', 'Hello there from Angular.');
    //   this.socket.on('my broadcast', (data: string) => {
    //     console.log(data);
    //   });

    // }

    receiveMessage(): any {
        return new Observable((observer) => {
            this.socket.on('message', (data: string) => {
                observer.next(data);
            });
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    joinChat(from: any, to: any) {
        let data = {
            fromUser: from,
            toUser: to
        }
        console.log("data", data);

        this.socket.emit('join_chat', data)
    }

    sendMessage(from: any, to: any, message: any) {
        let data = {
            fromUser: from,
            toUser: to,
            newMessageRecieved: message
        }

        this.socket.emit('new_message', data)
    }

}
