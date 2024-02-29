import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PixkeyRoutingModule } from './pixkey-routing.module';
import { ListComponent } from './list/list.component';
import { DeleteComponent } from './delete/delete.component';
import { FormComponent } from './form/form.component';
import { PixkeyAppComponent } from './pixkey.app.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NarikCustomValidatorsModule } from '@narik/custom-validators';


@NgModule({
  declarations: [
    ListComponent,
    DeleteComponent,
    FormComponent,
    PixkeyAppComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PixkeyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NarikCustomValidatorsModule
  ]
})
export class PixkeyModule { }
