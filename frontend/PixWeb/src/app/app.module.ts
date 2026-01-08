import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { NavigationModule } from './features/navigation/navigation.module';
import { LocalStorageUtils } from './utils/localstorage';
import { NgxSpinnerModule } from "ngx-spinner";
import { ErrorInterceptor } from "./services/error.handler.service";
import { SharedModule } from "./shared/shared.module";

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NavigationModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    ModalModule.forRoot(),
    SharedModule
  ],
  providers: [LocalStorageUtils, BsModalService, httpInterceptorProviders],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
