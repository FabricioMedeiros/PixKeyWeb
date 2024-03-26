import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PixKey } from '../models/pixkey';
import { Router } from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { PixKeyService } from './../services/pixkey.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  
  public pixKeys: PixKey[] = [];
  errorMessage: string = '';
  selectedPixKey!: PixKey;
  
  bsModalRef!: BsModalRef;
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;  

  constructor(
    private pixKeyService: PixKeyService, 
    private router: Router,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    
    this.pixKeyService.getAllPixKeys().subscribe({
      next: pixKeys => {
        this.pixKeys = pixKeys;
      },
      error: error => {
        this.errorMessage = error;
      },
    }); 
    
    this.spinner.hide();
  }

  getKeyTypeDescription(keyType: number): string {
    switch (keyType) {
      case 0:
        return 'CPF/CNPJ';
      case 1:
        return 'E-mail';
      case 2:
          return 'Telefone';  
      case 3:
          return 'Aleatória';      
      default:
        return 'Desconhecido';
    }
  }

  editPixKey(pixKey: PixKey) {
    this.router.navigate(['/pixkey/edit', pixKey.id]);
  }

  openDeleteModal(template: TemplateRef<any>, pixKey : PixKey) {
    this.selectedPixKey = pixKey;
    this.bsModalRef = this.modalService.show(template, this.selectedPixKey);
  }

  confirmDelete(pixKey: PixKey): void {  
    this.pixKeyService.deletePixKey(pixKey.id).subscribe({
      next: success => {
        this.processSuccess(success, pixKey);
      },
      error: error => {
        this.processFail(error);
      }
    });
  }

  processSuccess(response: any, pixKey: PixKey) {
    this.pixKeys = this.pixKeys.filter(item => item.id !== pixKey.id);
    this.bsModalRef.hide();
    
    let toast = this.toastr.success('Registro Excluído com Sucesso!', 'Atenção!');

    if (toast) {
      toast.onHidden.subscribe(() => {
        this.pixKeys = this.pixKeys.filter(item => item.id !== pixKey.id);
        this.bsModalRef.hide();
      });
    }
  }

  processFail(fail: any) {
    this.toastr.error('Ocorreu um erro.', 'Atenção');
  }
}