import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { PixKey } from './../models/pixkey';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';
import { PixKeyService } from '../services/pixkey.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, fromEvent, merge } from 'rxjs';
import { documentValidator } from '../../utils/document-validation';

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
  customMask: string = '';

  validationMessages!: ValidationMessages;
  genericValidator!: GenericValidator;
  displayMessage: DisplayMessage = {};

  changesSaved: boolean = true;
  isEditMode: boolean = false;
  isInvalidKey: boolean = false;

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
      },
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

    this.isInvalidKey = false;

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.loadPixKey(params['id']);
      }
    });

    this.pixKeyForm.get('keyType')?.valueChanges.subscribe(keyType => {
      this.applyValidationAndMask(keyType);
    });

    this.pixKeyForm.get('key')?.valueChanges.subscribe(key => {
      const keyTypeValueControl = this.pixKeyForm.get('keyType');
      
      if (keyTypeValueControl && keyTypeValueControl.value === '0') {
         this.customMask = this.getMaskForKeyType(keyTypeValueControl?.value);
      }

      this.pixKeyForm.get('key')?.markAsPristine();
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

  cancel(): void {
    this.router.navigate(['/pixkey/list']); 
  }

  getMaskForKeyType(keyType: string): string {
    if (keyType === '0') {
      const keyValueControl = this.pixKeyForm.get('key');

      if (keyValueControl && keyValueControl.value && keyValueControl.value.length <= 11) {
        return '000.000.000-009999';
      } else {
        return '00.000.000/0000-00';
      }
      
    } else {
      switch (keyType) {
        case '1':
          return '';
        case '2':
          return '(00) 00000-0000';
        case '3':
          return 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA';
        default:
          throw new Error('Tipo de chave não suportado: ' + keyType);
      }
    }
  }

  getValidatorsForKeyType(keyType: string) {
    switch (keyType) {
      case '0':
        return {
          validators: [Validators.required, documentValidator],
          messages: {
            required: 'Informe a Chave Pix',
            cpfInvalid: 'CPF Inválido.',
            cnpjInvalid: 'CNPJ Inválido.',
          }
        };
      case '1':
        return {
          validators: [Validators.required, Validators.email],
          messages: {
            required: 'Informe a Chave Pix',
            email: 'Email Inválido.'
          }
        };
      case '2':
        return {
          validators: [Validators.required, Validators.pattern(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/)],
          messages: {
            required: 'Informe a Chave Pix',
            pattern: 'Telefone Inválido.'
          }
        };
      case '3':
        return {
          validators: [Validators.required, Validators.pattern(/^([0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12})$/i)],
          messages: {
            required: 'Informe a Chave Pix',
            pattern: 'Chave Pix inválida.'
          }
        };
      default:
        throw new Error('Tipo de chave não suportado: ' + keyType);
    }
  }

  applyValidationAndMask(keyType : string): void {
    const keyValueControl = this.pixKeyForm.get('key');
    const { validators, messages } = this.getValidatorsForKeyType(keyType);
    
    keyValueControl?.clearValidators();

    if (validators) {
      keyValueControl?.setValidators(validators);
    }

    keyValueControl?.updateValueAndValidity();
    this.customMask = this.getMaskForKeyType(keyType);    

    this.validationMessages = Object.assign({}, this.validationMessages, { key: messages });
    this.genericValidator = new GenericValidator(this.validationMessages);

    this.pixKeyForm.get('key')?.reset('');
    this.pixKeyForm.get('key')?.markAsUntouched();
    this.pixKeyForm.get('key')?.markAsPristine();
    this.pixKeyForm.get('key')?.setErrors(null);
  }
}
