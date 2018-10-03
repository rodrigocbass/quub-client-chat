import { Component, OnInit } from '@angular/core';
import { Chat } from '../chat';
import { ChatService } from '../chat.service';
import { User } from '../user';
import {Paho} from 'ng2-mqtt/mqttws31';

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
  private client: Paho.MQTT.Client;
  options:Object;

  constructor(private chatService: ChatService) { 
    this.client = new Paho.MQTT.Client("localhost", 61614, "chat");
    this.client.connect({onSuccess: this.onConnected.bind(this)});

   // this.client.subscribe('quub_queue_chat', this.options);
    // this.client.connect({ userName:'quubmq', password:'B1n4r10quub',onSuccess: this.onConnected.bind(this)});
  }

  private onConnected():void {
    console.log('Connected to broker.'); 
    this.client.subscribe("QUUB", null);

    var message = new Paho.MQTT.Message("Olá");
    message.destinationName = "QUUB";
   // message.payloadString = "top";
    this.client.send(message);

    var message = new Paho.MQTT.Message("Deu tudo certo");
    message.destinationName = "QUUB";
   // message.payloadString = "top";
    this.client.send(message);

    this.client.onMessageArrived = function (message){
      console.log("Mensagem recebida: " + message.payloadString);
    }

    
  }

  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:");
    }
  }

  onMessageArrived(message) {
    console.log("onMessageArrived:");
  }


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
    this.processChats();
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