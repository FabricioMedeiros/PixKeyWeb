import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { PixKey } from './../models/pixkey';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';
import { PixKeyService } from '../services/pixkey.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, fromEvent, merge } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[] = [];

  errors: any[] = [];
  pixKeyForm!: FormGroup;
  pixKey!: PixKey;
  
  validationMessages!: ValidationMessages;
  genericValidator!: GenericValidator;
  displayMessage: DisplayMessage = {};

  changesSaved : boolean = true;
  isEditMode : boolean = false;

  constructor(private fb: FormBuilder,
    private pixKeyService: PixKeyService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService) {
 
    this.validationMessages = {
      description: {
        required: 'Informe a Descrição',
      },
      keyType: {
        required: 'Informe o Tipo da Chave Pix',
      },
      key: {
        required: 'Informe a Chave Pix',
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);    
  }

  ngOnInit(): void {
    this.pixKeyForm = this.fb.group({
      description: ['', [Validators.required]],
      keyType: ['', [Validators.required]],
      key: ['', [Validators.required]],
      isPersonalKey: [false]   
    });   
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.loadPixKey(params['id']);
      }
    });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.pixKeyForm);
      this.changesSaved = false;
    });
  }

  // loadPixKey(id: string) {
  //   this.pixKeyService.getPixKeyById(id).subscribe({
  //     next: (pixKey) => {this.pixKey = pixKey},
  //     error: (error) => {console.error(error);}
  //   });
  // }

  loadPixKey(id: number) {
    this.pixKeyService.getPixKeyById(id).subscribe({
      next: (pixKey) => {
        this.pixKey = pixKey;
        this.pixKeyForm.patchValue({
          description: pixKey.description,
          keyType: pixKey.keyType.toString(),
          key: pixKey.key,
          isPersonalKey: pixKey.isPersonalKey,
        });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }  

  savePixKey() {   
    if (this.pixKeyForm.dirty && this.pixKeyForm.valid) {     
      this.pixKeyForm.value.keyType = Number(this.pixKeyForm.value.keyType);
      this.pixKey = Object.assign({}, this.pixKey, this.pixKeyForm.value);    
     
      if (this.isEditMode) {       
        this.pixKeyService.updatePixKey(this.pixKey).subscribe({
          next: (success) => {
          
            this.processSuccess(success);
          },
          error: (error) => {
          
            this.processFail(error);
          }
        });
      } else {
        this.pixKeyService.registerPixKey(this.pixKey).subscribe({
          next: (success) => {
            
            this.processSuccess(success);
          },
          error: (error) => {
           
            this.processFail(error);
          }
        });
      }
  
      this.changesSaved = true;
    }
  }
  
  processSuccess(response: any) {
    this.pixKeyForm.reset();
    this.errors = [];
    
    let toast = this.toastr.success(this.isEditMode ? 'Chave Pix Alterada com Sucesso!' : 'Chave Pix Cadastrada com Sucesso!', 'Atenção!');

    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/pixkey/list']);
      });
    }
  }

  processFail(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro.', 'Atenção');
  }
}
