import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat } from './chat';
import { User } from './user';
import { BaseconfigService } from './config/baseconfig.service';
import { PalavraRestrita } from './palavrarestrita';

 
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor( 
    private http: HttpClient,
    private baseConfig: BaseconfigService
  ) { 

  }
 
  getChats (): Observable<string[]> {
    return this.http.get<string[]>(this.baseConfig.URL_API + this.baseConfig.RECUPERA_CHAT);
  }

  getListaRestricoes (): Observable<PalavraRestrita[]> {
    return this.http.get<PalavraRestrita[]>(this.baseConfig.URL_API + this.baseConfig.LISTA_RESTRICOES);
  }

  getListaUsuarios (): Observable<User[]> {
    return this.http.get<User[]>(this.baseConfig.URL_API + this.baseConfig.LISTA_USUARIOS);
  }
  
  initChat (user: User): Observable<User> {
    return this.http.post<User>(this.baseConfig.URL_API + this.baseConfig.LOGIN_USUARIO, user, httpOptions);
  }

  login(user: User) :Promise<User>{
    return this.http.post<User>(this.baseConfig.URL_API + this.baseConfig.LOGIN_USUARIO, user, httpOptions)
    .toPromise()
    .then(response =>{
      return response;
    }).catch(response =>{
      if(response.status === 400){
        return Promise.reject('Cpf e/ou email inválido(s).');
      }
      return Promise.reject(response);  
    });
  }

  
  addMessage(chat: Chat): Observable<Chat> {
    console.log(chat);
    return this.http.post<Chat>(this.baseConfig.URL_API + this.baseConfig.SEND_MESSAGE, chat, httpOptions);
  }
}