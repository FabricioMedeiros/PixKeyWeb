import { AccountService } from './../services/account.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';

import { CustomValidators } from '@narik/custom-validators';
import { Observable, fromEvent, merge } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[] = [];

  errors: any[] = [];
  loginForm!: FormGroup;
  user!: User;
  hidePassword: boolean = true;

  validationMessages!: ValidationMessages;
  genericValidator!: GenericValidator;
  displayMessage: DisplayMessage = {};

  returnUrl: String;  

  constructor(private fb: FormBuilder, private accountService: AccountService,
    private router: Router, private route : ActivatedRoute, private toastr: ToastrService) {   

    this.validationMessages = {
      email: {
        required: 'Informe o e-mail',
        email: 'Email inválido'
      },
      password: {
        required: 'Informe a senha',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres'
      }
    };

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]]
    })
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.loginForm);
    });
  }

  Login() {
    if (this.loginForm.dirty && this.loginForm.valid) {
      this.user = Object.assign({}, this.user, this.loginForm.value);
      this.accountService.login(this.user).subscribe({
        next: (success) => {
          this.processSuccess(success);
        },
        error: (error) => {
          this.processFail(error);
        }
      });
    }
  }

  processSuccess(response: any) {
    this.loginForm.reset();
    this.errors = [];

    this.accountService.LocalStorage.saveLocalUserData(response);

    let toast = this.toastr.success('Login realizado com Sucesso!', 'Bem vindo!');

    if (toast) {
      toast.onHidden.subscribe(() => {
        this.returnUrl ? this.router.navigate([this.returnUrl]) : this.router.navigate(['/home']);
      });
    }
  }

  processFail(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro.', 'Atenção');
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}



