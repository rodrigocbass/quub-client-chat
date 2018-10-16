import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseconfigService {
  public FILA_PADRAO_CHAT: string = 'QUUB';
  public FILA_PADRAO_REGISTER: string = 'quub_queue_chat_login';
  public FILA_PADRAO_UNREGISTER: string = 'quub_queue_chat_logout';

  //MQTT
  public URL_MQTT: string = '<documento em anexo>';
  public PORTA_MQTT: number = 61614;
  public USER_MQTT: string = 'quubmq';
  public PASSWORD_MQTT: string = '<documento em anexo>';

  //API
  public URL_API: string = 'http://localhost:8080';

  //API PRODUÇÃO


  
  //END POINTS
  public LOGIN_USUARIO: string = '/api/user';
  public RECUPERA_CHAT: string = '/api/chats';
  public SEND_MESSAGE: string = '/api/message';
  public LISTA_RESTRICOES: string = '/api/restricoes';
  public LISTA_USUARIOS: string = '/api/usersconnect'

  constructor() { }
}
