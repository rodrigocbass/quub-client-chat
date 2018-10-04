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
  teste = [];
  submitted = false;
  processing = false;
  private client: Paho.MQTT.Client;
  options:Object;

  constructor(private chatService: ChatService) { 
 
    var codigo = "id_" + (Math.random() * 100);
    this.client = new Paho.MQTT.Client("191.232.197.219", 61614, codigo);
    //this.client.connect({onSuccess: this.onConnected.bind(this)});

  // this.client.subscribe('quub_queue_chat', this.options);
    this.client.connect({ userName:'quubmq', password:'B1n4r10quub',onSuccess: this.onConnected.bind(this)});
    // set callback handlers
    this.client.onConnectionLost = this.onConnectionLost;
    this.client.onMessageArrived = this.onMessageArrived;


    if(localStorage.getItem("user") != null){
      this.submitted = true;
      this.user = JSON.parse(localStorage.getItem("user"));
    }
  }

  public onConnected():void {
    console.log('Connected to broker.'); 
    this.client.subscribe("QUUB", null);   
  }

  public publicaMensagem(chat:Chat):void{
    this.chats.push(chat);
  }

  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:");
    }
  }

  onMessageArrived(message) {
    var chat :Chat = JSON.parse(message.payloadString);
    var chats: Chat[] = JSON.parse(localStorage.getItem("linhaDoTempo"));
    if(chats == undefined || chats == null){
      chats = [];
    }
    chats.push(chat);
    localStorage.setItem("linhaDoTempo", JSON.stringify(chats));

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
        localStorage.setItem("user", JSON.stringify(this.user));
       
      }
    );
  }

  public enviaMensagem(msg:string):void{
    var message = new Paho.MQTT.Message(msg);
    message.destinationName = "QUUB";
   // message.payloadString = "top";
    this.client.send(message);
    this.chat.msg = "";
  }

  addMessage() {
    if(this.chat.msg != null && this.chat.msg != "" && this.chat.msg != undefined){
      this.submitted = true;
      this.chat.user = this.user;
      var msg = JSON.stringify(this.chat);
      this.enviaMensagem(msg);
    }
  }

  public exibe(){
    return JSON.parse(localStorage.getItem('linhaDoTempo'));
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