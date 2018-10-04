import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat } from './chat';
import { User } from './user';

 
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor( 
    private http: HttpClient
  ) { 

  }
 
  getChats (): Observable<string[]> {
    return this.http.get<string[]>("https://servico.quub.com.br:8443/quub-chat-1.0/api/chats")
  }
  
  initChat (user: User): Observable<Chat> {
    console.log(user);
    return this.http.post<Chat>("https://servico.quub.com.br:8443/quub-chat-1.0/api/user", user, httpOptions);
  }

  
  addMessage(chat: Chat): Observable<Chat> {
    console.log(chat);
    return this.http.post<Chat>("https://servico.quub.com.br:8443/quub-chat-1.0/api/message", chat, httpOptions);
  }
}