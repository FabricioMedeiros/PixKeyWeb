import { FormBuilder, FormControlName, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, fromEvent, merge } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { PixKey } from './../models/pixkey';
import { PixKeyService } from '../services/pixkey.service';
import { DisplayMessage, GenericValidator, ValidationMessages } from 'src/app/utils/generic-form-validation';
import { documentValidator } from 'src/app/utils/document-validation';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[] = [];

  errors: any[] = [];
  pixKeyForm!: FormGroup;
  pixKey!: PixKey;

  customMask: string = '';
  displayMessage: DisplayMessage = {};
  changesSaved: boolean = true;
  isEditMode: boolean = false;
  userIsChangingKeyType = false;

  private validationMessages: ValidationMessages;
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private pixKeyService: PixKeyService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
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

  get keyControl() {
    return this.pixKeyForm.get('key');
  }

  ngOnInit(): void {
    this.pixKeyForm = this.fb.group({
      id: ['', []],
      description: ['', [Validators.required]],
      keyType: ['', [Validators.required]],
      key: ['', [Validators.required]],
      isPersonalKey: [false]
    });

    const resolvedData = this.route.snapshot.data['pixKey'];

    if (resolvedData) {
      this.spinner.show();
      this.isEditMode = true;
      this.pixKeyForm.patchValue(resolvedData);
      this.applyValidationAndMask(resolvedData.keyType.toString());
    } else {
      this.applyValidationAndMask(this.pixKeyForm.get('keyType')?.value);
    }

    this.pixKeyForm.get('keyType')?.valueChanges.subscribe(keyType => {
      this.userIsChangingKeyType = true;
      this.applyValidationAndMask(keyType);
      this.userIsChangingKeyType = false;
    });

    this.pixKeyForm.get('key')?.valueChanges.subscribe(key => {
      const keyTypeValueControl = this.pixKeyForm.get('keyType');
      if (keyTypeValueControl?.value === '0') {
        this.customMask = this.getMaskForKeyType(keyTypeValueControl.value);
      }
    });

    this.spinner.hide();
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) =>
        fromEvent(formControl.nativeElement, 'blur')
    );

    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(
        this.pixKeyForm
      );
      this.changesSaved = false;
    });
  }

  initializeForm(): void {
    this.pixKeyForm = this.fb.group({
      id: ['', []],
      description: ['', [Validators.required]],
      keyType: ['', [Validators.required]],
      key: ['', [Validators.required]],
      isPersonalKey: [false],
    });
  }

  savePixKey(): void {
    if (this.pixKeyForm.dirty && this.pixKeyForm.valid) {
      this.pixKeyForm.value.keyType = Number(this.pixKeyForm.value.keyType);
      this.pixKey = Object.assign({}, this.pixKey, this.pixKeyForm.value);

      const request$ = this.isEditMode
        ? this.pixKeyService.updatePixKey(this.pixKey)
        : this.pixKeyService.registerPixKey(this.pixKey);

      request$.subscribe({
        next: (response) => this.processSuccess(response),
        error: (error) => this.processFail(error),
      });

      this.changesSaved = true;
    }
  }

  processSuccess(response: any): void {
    this.pixKeyForm.reset();
    this.errors = [];

    const toast = this.toastr.success(
      this.isEditMode
        ? 'Chave Pix Alterada com Sucesso!'
        : 'Chave Pix Cadastrada com Sucesso!',
      'Atenção!'
    );

    toast?.onHidden.subscribe(() => {
      this.router.navigate(['/pixkey/list']);
    });
  }

  processFail(error: any): void {
    this.errors = error?.error?.errors || [];
    this.toastr.error('Ocorreu um erro.', 'Atenção');
  }

  cancel(): void {
    this.router.navigate(['/pixkey/list']);
  }

  applyValidationAndMask(keyType: string): void {
    const control = this.keyControl;
    const { validators, messages } = this.getValidatorsForKeyType(keyType);

    control?.clearValidators();
    control?.setValidators(validators);
    control?.updateValueAndValidity();

    this.customMask = this.getMaskForKeyType(keyType);

    this.validationMessages = {
      ...this.validationMessages,
      key: messages,
    };

    this.genericValidator = new GenericValidator(this.validationMessages);

    if (!this.isEditMode || this.userIsChangingKeyType) {
      control?.reset('');
      control?.markAsUntouched();
      control?.markAsPristine();
      control?.setErrors(null);
    }
  }

  getMaskForKeyType(keyType: string): string {
    if (keyType === '0') {
      return this.keyControl?.value?.length <= 11
        ? '000.000.000-009999'
        : '00.000.000/0000-00';
    }

    const maskMap: Record<string, string> = {
      '1': '',
      '2': '(00) 00000-0000',
      '3': 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA',
    };

    return maskMap[keyType] || '';
  }

  getValidatorsForKeyType(
    keyType: string
  ): { validators: ValidatorFn[]; messages: any } {
    const validatorMap: Record<string, () => { validators: ValidatorFn[]; messages: any }> = {
      '0': () => ({
        validators: [Validators.required, documentValidator],
        messages: {
          required: 'Informe a Chave Pix',
          cpfInvalid: 'CPF Inválido.',
          cnpjInvalid: 'CNPJ Inválido.',
        },
      }),
      '1': () => ({
        validators: [Validators.required, Validators.email],
        messages: {
          required: 'Informe a Chave Pix',
          email: 'Email Inválido.',
        },
      }),
      '2': () => ({
        validators: [
          Validators.required,
          Validators.pattern(/^\(?\d{2}\)?\s?9\d{4}-?\d{4}$/),
        ],
        messages: {
          required: 'Informe a Chave Pix',
          pattern: 'Telefone celular inválido. Use o formato (XX) 9XXXX-XXXX',
        },
      }),
      '3': () => ({
        validators: [
          Validators.required,
          Validators.pattern(
            /^([0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12})$/i
          ),
        ],
        messages: {
          required: 'Informe a Chave Pix',
          pattern: 'Chave Pix inválida.',
        },
      }),
    };

    return validatorMap[keyType]?.() || {
      validators: [Validators.required],
      messages: { required: 'Informe a Chave Pix' },
    };
  }
}
