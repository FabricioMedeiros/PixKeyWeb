
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PixkeyRoutingModule } from './pixkey-routing.module';
import { ListComponent } from './list/list.component';
import { DeleteComponent } from './delete/delete.component';
import { FormComponent } from './form/form.component';
import { PixkeyAppComponent } from './pixkey.app.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NarikCustomValidatorsModule } from '@narik/custom-validators';
import { PixKeyService } from './services/pixkey.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { KeyMaskPipe } from '../pipes/key-mask.pipe';


@NgModule({
  declarations: [
    ListComponent,
    DeleteComponent,
    FormComponent,
    PixkeyAppComponent,
    KeyMaskPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    PixkeyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NarikCustomValidatorsModule,
    NgxMaskDirective, 
    NgxMaskPipe,
    NgxSpinnerModule
  ],
  providers: [
    PixKeyService,
    provideNgxMask()  
  ],
})
export class PixkeyModule { }
