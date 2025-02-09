import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // นำเข้า FormsModule
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // เพิ่ม RouterModule
import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HistoryComponent } from './history/history.component';
import { UsermanagementComponent } from './usermanagement/usermanagement.component';
import { AddUserComponent } from './add-user/add-user.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HistoryComponent,
    UsermanagementComponent,
    AddUserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule // เพิ่ม FormsModule ที่นี่
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
