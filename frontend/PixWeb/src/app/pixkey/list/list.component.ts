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

  currentPage : number = 1;
  totalPages : number = 1;
  
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

    let storedPage = localStorage.getItem('currentPagePixKeyList');

    if (storedPage) {
      this.currentPage = parseInt(storedPage, 10);
      localStorage.removeItem('currentPagePixKeyList'); 
      storedPage = null;
    }
    
    this.loadPixKeys();
  }

  onPageChanged(page: number) {
    this.currentPage = page;
    this.loadPixKeys();
  }

  loadPixKeys(): void {
    this.spinner.show();

    this.pixKeys = []; 
    
    this.pixKeyService.getAllPixKeys(this.currentPage, 4).subscribe({
      next: response => {      
        this.pixKeys = response.pixKeys;
        this.currentPage = response.page;    
        this.totalPages = Math.ceil(response.totalRecords / response.pageSize);
      },
      error: error => {
        this.errorMessage = error;
      },
      complete: () => {
        this.spinner.hide();
      }
    }); 
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
    localStorage.setItem('currentPagePixKeyList', this.currentPage.toString());
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