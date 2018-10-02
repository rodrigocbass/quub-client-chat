import { Component, OnInit } from '@angular/core';
import { Chat } from '../chat';
import { ChatService } from '../chat.service';
import { User } from '../user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent{

  chat = new Chat();
  user = new User();
  chats: Chat[];
  submitted = false;
  processing = false;

  constructor(private chatService: ChatService) { }

  newChat(): void {
    this.submitted = false;
    this.processing = false;
    this.chat = new Chat();
  }
 
  initChat() {
    this.submitted = true;
    this.chatService.initChat(this.user)
    .subscribe(
      chat =>{
        this.chat = chat;
        this.user = chat.user;
      }
    );
  }

  addMessage() {
    this.submitted = true;
    this.chat.user = this.user;
    this.chatService.addMessage(this.chat)
    .subscribe();
  }

  processChats(){
    this.processing = true;
    return this.chatService.getChats()
                .subscribe(
                  chats => {
                    console.log(chats);
                    this.chats = chats;
                  }
                );
  }
}