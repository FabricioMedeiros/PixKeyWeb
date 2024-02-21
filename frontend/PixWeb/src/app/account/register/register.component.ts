import { AccountService } from './../services/account.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';
import { ValidationMessages, GenericValidator, DisplayMessage } from 'src/app/utils/generic-form-validation';
import { CustomValidators } from '@narik/custom-validators';
import { Observable, fromEvent, merge } from 'rxjs';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit{

  @ViewChildren(FormControlName, { read: ElementRef })  formInputElements: ElementRef[] = [];

  errors: any[] = [];
  registerForm!: FormGroup;
  user!: User;
  
  validationMessages!: ValidationMessages;
  genericValidator!: GenericValidator;
  displayMessage: DisplayMessage = {};

  constructor(private fb: FormBuilder, private accountService : AccountService,
    private router : Router){
    
    this.validationMessages = {
      name:{
        required: 'Informe o nome',
      },
      email: {
        required: 'Informe o e-mail',
        email: 'Email inválido'
      },
      password: {
        required: 'Informe a senha',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }
  
  ngOnInit(): void {
    let password = new FormControl('', [Validators.required, CustomValidators.rangeLength([6, 15])]);    

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: password
    })
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.registerForm);
    });
  }
  
  addAccount() {
    if (this.registerForm.dirty && this.registerForm.valid) {
     this.user = Object.assign({}, this.user, this.registerForm.value);
     this.accountService.registerUser(this.user).
     subscribe(
      sucess => {this.processSuccess(sucess)} ,
      fail => {this.processFail(fail)}
     );
    }
  }

  processSuccess(response : any) {
    this.registerForm.reset();
    this.errors = [];

    this.accountService.LocalStorage.saveLocalUserData(response);

    this.router.navigate(['/home']);
  }  

  processFail(fail : any) {
    this.errors = fail.error.errors;
  }  
}
