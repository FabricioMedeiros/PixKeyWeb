import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NarikCustomValidatorsModule } from '@narik/custom-validators';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';

import { PixkeyRoutingModule } from './pixkey-routing.module';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { PixkeyAppComponent } from './pixkey.app.component';
import { PixKeyService } from './services/pixkey.service';
import { KeyMaskPipe } from 'src/app/pipes/key-mask.pipe';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ListComponent,
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
    NgxSpinnerModule,
    SharedModule,
  ],
  providers: [
    PixKeyService,
    provideNgxMask()  
  ],
})
export class PixkeyModule { }
