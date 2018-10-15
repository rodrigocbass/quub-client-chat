import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IP } from './ip';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  publicIP;

  constructor(private http: HttpClient){
    /**
     * Lendo ip publico
     */
    this.http.get("https://api.ipify.org?format=json")
    .subscribe(data => {
      this.publicIP=data['ip'];
      //console.log(this.publicIP);
      localStorage.setItem("ip",this.publicIP);
    });                

  }
}
