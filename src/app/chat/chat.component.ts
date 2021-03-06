import { Component, OnInit,AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Chat } from '../chat';
import { ChatService } from '../chat.service';
import { User } from '../user';
import {Paho} from 'ng2-mqtt/mqttws31';
import { BaseconfigService } from '../config/baseconfig.service';
import { PalavraRestrita } from '../palavrarestrita';
import { ToastyConfig, ToastyService } from 'ng2-toasty';
import { RegisterUser } from '../RegisterUser';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  chat = new Chat();
  user = new User();
  userReservado: RegisterUser;
  mostraReservado: boolean = false;

  chats: Chat[];
  registerUsers: any[];
  registerUserSelected: RegisterUser;
  submitted = false;
  private client: Paho.MQTT.Client;
  options:Object;

  constructor(private chatService: ChatService,
              private baseConfig: BaseconfigService,
              private toastyConfig: ToastyConfig,
              private toasty: ToastyService) {       
                

    this.toastyConfig.theme = 'bootstrap';                
 
    var codigo = "id_" + (Math.random() * 100);
    this.client = new Paho.MQTT.Client(this.baseConfig.URL_MQTT, this.baseConfig.PORTA_MQTT, codigo);
    //this.client.connect({onSuccess: this.onConnected.bind(this)});

  // this.client.subscribe('quub_queue_chat', this.options);
    this.client.connect({ userName: this.baseConfig.USER_MQTT, password: this.baseConfig.PASSWORD_MQTT,onSuccess: this.onConnected.bind(this)});
    // set callback handlers
    this.client.onConnectionLost = this.onConnectionLost;
    this.client.onMessageArrived = this.onMessageArrived;

    //Recupera palavras restritas
    this.recuperaListaRestricoes();
    this.recuperaListaUserLogados();

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
    this.client.subscribe(this.baseConfig.FILA_PADRAO_CHAT, null); 
    this.verificarUsuarioOnline();  

  }

  public verificarUsuarioOnline(){

    //this.client.stopTrace();
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
    this.user.ipPublico = localStorage.getItem("ip");
   this.chatService.login(this.user)
      .then(user => {
        //this.toasty.success('Usuário autenticado com sucesso!');
        localStorage.setItem('user', JSON.stringify(user));
        this.client.subscribe('id_' + user.codAcesso, null);
        this.client.subscribe(this.baseConfig.FILA_PADRAO_CHAT, null); 
        this.registraUsuario(user);
        this.submitted = true;
      })
      .catch(erro => {
        this.toasty.error('Cpf e/ou email inválido(s).');
      });

    
  }

  recuperaListaRestricoes(){
    this.chatService.getListaRestricoes()
      .subscribe(palavraRestrita =>{
          localStorage.setItem('restricoes', JSON.stringify(palavraRestrita));
      });
  }

  recuperaListaUserLogados(){
    this.chatService.getListaUsuarios()
      .subscribe(registerUser =>{
          this.registerUsers = registerUser;
          localStorage.setItem('registerUser', JSON.stringify(registerUser));
      });
  }

  private registraUsuario(user: User){
    var msg = JSON.stringify(user);
    this.enviaMensagem(msg, this.baseConfig.FILA_PADRAO_REGISTER);
  }

  private desconectarRegistraUsuario(user: User){
    var msg = JSON.stringify(user);
    this.enviaMensagem(msg, this.baseConfig.FILA_PADRAO_UNREGISTER);
  }

  public enviaMensagem(msg: string, topic: string): void {
    var message = new Paho.MQTT.Message(msg);
    message.destinationName = topic;
   // message.payloadString = "top";
    if(this.client.isConnected()){
      this.client.send(message);
    }else{
      var user = JSON.parse(localStorage.getItem('user'));
      this.desconectarRegistraUsuario(user);
    }
    this.chat.msg = "";
  }

  

  addMessage() {
    var retorno:any = null;
    var topicEnvio = null;
 
    if(this.chat.msg != null && this.chat.msg != '' && this.chat.msg != undefined){
      var restricoes:PalavraRestrita[] = JSON.parse(localStorage.getItem('restricoes'));
      if(restricoes != null){
        retorno = restricoes.find(e =>  this.chat.msg.indexOf(e.descricao) != -1);
      }
      if(retorno == undefined){
        this.submitted = true;
        this.chat.user = this.user;
        var msg = null;
        if(this.userReservado == null){
          topicEnvio = this.baseConfig.FILA_PADRAO_CHAT;
          msg = JSON.stringify(this.chat);
        }else{
          topicEnvio = 'id_' + this.userReservado.codAcesso;
          this.chat.userDestination = this.userReservado.user;
          msg = JSON.stringify(this.chat);
        }
        this.enviaMensagem(msg, topicEnvio); 
      }else{
        this.toasty.error('A palavra <b>' + retorno.descricao + '</b> não pode ser utilizada.');
      }
    }
  }

  sair(){
    var user = JSON.parse(localStorage.getItem('user'));
    //AVISAR SERVIDOR QUE USUÁRIO DESCONECTOU
    this.desconectarRegistraUsuario(user);
    this.client.unsubscribe(this.baseConfig.FILA_PADRAO_CHAT, null);
    this.client.unsubscribe('id_' + user.codAcesso, null); 
    localStorage.removeItem('linhaDoTempo');
    localStorage.removeItem('user');
    this.submitted = false;
  }

  public exibe(){
      var dadosExibe = JSON.parse(localStorage.getItem('linhaDoTempo')); 
      return dadosExibe;
  }

  public selecionaUsuarioReservado(registroUsuario:RegisterUser){
    if(this.userReservado != null && this.userReservado != undefined){
      this.client.unsubscribe('id_' + this.userReservado.codAcesso, null); 
      

    }
    if (registroUsuario != null){
      this.client.subscribe('id_' + registroUsuario.codAcesso, null);
      this.userReservado = registroUsuario;
      this.mostraReservado = true;
    }else{
      this.userReservado = null;
      this.mostraReservado = false;
    }
    this.client.subscribe('id_' + this.user.codAcesso, null);
  }
}