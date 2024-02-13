import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { SocketioService } from '../socketio.service';
import { io } from 'socket.io-client';
import { environment } from 'enviroment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  socket: any;
  constructor(
    private authService: AuthService,
    private socketService: SocketioService,

  ) {
    this.socket = io(environment.SOCKET_URL)
  }

  getUsers: any = []
  loggedInUser: any = this.authService.getUser();
  roomId: any = null;
  openConversation: any = null;
  openChatHistory: any = [];
  ngOnInit(): void {
    this.fetchConversations();
  }

  fetchConversations() {
    this.authService.getConversations().subscribe((res) => {
      console.log('res.success: ', res.success);
      if (res.success) {
        this.getUsers = res.result
        console.log('getUsers: ', this.getUsers);
      }
    });
  }

  viewConversation(user: any) {
    this.openConversation = user;
    if (this.loggedInUser.id < user.id) this.roomId = this.loggedInUser.id + "_" + user.id
    else this.roomId = user.id + "_" + this.loggedInUser.id
    this.socketService.joinChat(this.loggedInUser.id, user.id)
    this.socket.on("message_received", (data: string) => {
      console.log(data);
    });
    this.socket.on('data', (data: any) => {
      console.log('Received data:', data);
      // Handle the received data
    });
    // this.authService.getChatHistory(this.roomId).subscribe(res => {
    //   this.openChatHistory = res.result;
    // })

    setInterval(() => {
      this.authService.getChatHistory(this.roomId).subscribe(res => {
        this.openChatHistory = res.result;
      })
    }, 1000);

  }

  onEnter(event: any) {
    const input = event.target.value;
    event.target.value = "";
    this.socketService.sendMessage(this.loggedInUser.id, this.openConversation.id, input)
  }

  joinChat(from: any, to: any) {
    let data = {
      fromUser: from,
      toUser: to
    }
    console.log("data", data);

    this.socket.emit('join_chat', data)
  }

}
