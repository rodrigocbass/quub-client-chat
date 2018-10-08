import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule }   from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import {ToastyModule} from 'ng2-toasty';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InputMaskModule} from 'primeng/inputmask';
import {InputTextModule} from 'primeng/inputtext';

import { DataTableModule,PaginatorModule } from 'primeng/primeng'; 
import {TableModule} from 'primeng/table';


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    InputMaskModule,
    InputTextModule,
    DataTableModule,
    TableModule,
    PaginatorModule,
    ToastyModule.forRoot()
  ],
 // exports: [BrowserModule,ToastyModule]
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }