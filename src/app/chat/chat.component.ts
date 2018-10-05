import { Component, OnInit,AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Chat } from '../chat';
import { ChatService } from '../chat.service';
import { User } from '../user';
import {Paho} from 'ng2-mqtt/mqttws31';
import { BaseconfigService } from '../config/baseconfig.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  chat = new Chat();
  user = new User();

  chats: Chat[];
  teste = [];
  submitted = false;
  private client: Paho.MQTT.Client;
  options:Object;

  constructor(private chatService: ChatService, private baseConfig: BaseconfigService) { 
 
    var codigo = "id_" + (Math.random() * 100);
    this.client = new Paho.MQTT.Client(this.baseConfig.URL_MQTT, this.baseConfig.PORTA_MQTT, codigo);
    //this.client.connect({onSuccess: this.onConnected.bind(this)});

  // this.client.subscribe('quub_queue_chat', this.options);
    this.client.connect({ userName: this.baseConfig.USER_MQTT, password: this.baseConfig.PASSWORD_MQTT,onSuccess: this.onConnected.bind(this)});
    // set callback handlers
    this.client.onConnectionLost = this.onConnectionLost;
    this.client.onMessageArrived = this.onMessageArrived;


    if(localStorage.getItem("user") != null){
      this.submitted = true;
      this.user = JSON.parse(localStorage.getItem("user"));
    }
  }

  ngOnInit() { 
    this.scrollToBottom();
}

ngAfterViewChecked() {        
    this.scrollToBottom();        
} 

scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
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
    this.chat = new Chat();
  }
 
  initChat() {
    this.submitted = true;
    this.chatService.initChat(this.user)
    .subscribe(
      user => {
        localStorage.setItem('user', JSON.stringify(this.user));
        this.client.subscribe('id_' + user.codAcesso, null);
        this.registraUsuario(user);
       
      }
    );
  }

  private registraUsuario(user: User){
    var msg = JSON.stringify(this.chat);
    this.enviaMensagem(msg, this.baseConfig.FILA_PADRAO_REGISTER);
  }

  public enviaMensagem(msg: string, topic: string): void {
    var message = new Paho.MQTT.Message(msg);
    message.destinationName = topic;
   // message.payloadString = "top";
    this.client.send(message);
    this.chat.msg = "";
  }

  addMessage() {
    if(this.chat.msg != null && this.chat.msg != '' && this.chat.msg != undefined){
      this.submitted = true;
      this.chat.user = this.user;
      var msg = JSON.stringify(this.chat);
      this.enviaMensagem(msg, this.baseConfig.FILA_PADRAO_CHAT); 
    }
  }

  public exibe(){
      return JSON.parse(localStorage.getItem('linhaDoTempo')); 
  }
}