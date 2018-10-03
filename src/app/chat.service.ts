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
 
  getChats (): Observable<Chat[]> {
    return this.http.get<Chat[]>("http://localhost:8080/api/chats")
  }
  
  initChat (user: User): Observable<Chat> {
    console.log(user);
    return this.http.post<Chat>("http://localhost:8080/api/user", user, httpOptions);
  }

  
  addMessage(chat: Chat): Observable<Chat> {
    console.log(chat);
    return this.http.post<Chat>("http://localhost:8080/api/message", chat, httpOptions);
  }
}