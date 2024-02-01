import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { AccountRoutingModule } from './account-routing.module';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AccountAppComponent } from './account.app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AccountAppComponent,
    RegisterComponent, 
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AccountRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    
  ]
})
export class AccountModule { }
