import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ButtonScrollTopComponent } from './components/button-scroll-top/button-scroll-top.component';
import { PaginationComponent } from './components/pagination/pagination.component';

@NgModule({
  declarations: [
    PaginationComponent,
    SearchBarComponent,
    ButtonScrollTopComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    PaginationComponent,
    SearchBarComponent,
    ButtonScrollTopComponent
  ]
})
export class SharedModule { }
