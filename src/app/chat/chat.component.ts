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
     this.client = new Paho.MQTT.Client("191.232.197.219", 61614, "chat");
    //this.client.connect({onSuccess: this.onConnected.bind(this)});

   // this.client.subscribe('quub_queue_chat', this.options);
     this.client.connect({ userName:'quubmq', password:'B1n4r10quub',onSuccess: this.onConnected.bind(this)});
  }

  private onConnected():void {
    console.log('Connected to broker.'); 
    this.client.subscribe("QUUB", null);
    this.client.onMessageArrived = function (message){
      console.log("Mensagem recebida: " + message.payloadString);
      //this.chats.push(message.payloadString);
      
      var chat :Chat = JSON.parse(message.payloadString);
      if(this.chats == undefined || this.chats == null){
        this.chats = [];
      }
      this.chats.push(chat);
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

  public enviaMensagem(msg:string):void{
    var message = new Paho.MQTT.Message(msg);
    message.destinationName = "QUUB";
   // message.payloadString = "top";
    this.client.send(message);
  }

  addMessage() {
    this.submitted = true;
    this.chat.user = this.user;
    var msg = JSON.stringify(this.chat);
    this.enviaMensagem(msg);
  }

  processChats(){
    this.processing = true;
    return this.chatService.getChats()
                .subscribe(
                  chats => {
                    console.log(chats);
                  }
                );
  }
}