import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PixKey } from '../models/pixkey';
import { Router, NavigationEnd, Event } from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { PixKeyService } from './../services/pixkey.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { filter, map } from 'rxjs';


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
  pageSize: number = 10;
  totalPages : number = 1;
 
  searchTerm : string = '';
  loadingKeys : boolean = true;

  @Input() placeholderSearch: string = 'Pesquise pela descrição';
  
  bsModalRef!: BsModalRef;
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;  

  constructor(
    private pixKeyService: PixKeyService, 
    private router: Router,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { 
    this.router.events.pipe(
      filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e)
    ).subscribe(event => {
      if (!event.url.includes('/pixkey')){
        this.pixKeyService.clearLocalCurrentPageList();
        this.pixKeyService.clearLocalSearchTerm();
      }
    });
  }

  ngOnInit(): void {
    let storedPage = this.pixKeyService.getLocalCurrentPageList();
    let storedSearchTerm = this.pixKeyService.getLocalSearchTerm();

    if (storedPage.trim() !== ''){
      this.currentPage = parseInt(storedPage, 10);
      this.pixKeyService.clearLocalCurrentPageList();
      storedPage = '';
    }
    
    if (storedSearchTerm.trim() !== '') {
      this.searchTerm = storedSearchTerm;
      this.loadPixKeys();
      storedSearchTerm = '';    
    }
    else {
      this.loadPixKeys();
    }    
  }

  onPageChanged(page: number) {
    this.currentPage = page;

    let storedSearchTerm = this.pixKeyService.getLocalSearchTerm();

    if (storedSearchTerm) {
      this.searchTerm = storedSearchTerm;
      this.loadPixKeys();      
    }
    else {
      this.loadPixKeys();
    }    
  }

  loadPixKeys(): void {
    this.spinner.show();
    this.loadingKeys = true;
    this.pixKeys = []; 

    if (this.searchTerm !== null && this.searchTerm !== undefined && this.searchTerm.trim() !== '') {
        this.pixKeyService.getAllPixKeys(this.currentPage, this.pageSize, 'Description', this.searchTerm).subscribe({
        next: response => {
          this.processLoadPixKeysSucess(response);
        },
        error: error => {
          this.processLoadPixKeysFail(error);
        },
        complete: () => {
          this.processLoadPixKeysComplete();
        }
      });
    } else {
      this.pixKeyService.getAllPixKeys(this.currentPage, this.pageSize).subscribe({
        next: response => {      
          this.processLoadPixKeysSucess(response);
        },
        error: error => {
          this.processLoadPixKeysFail(error);
        },
        complete: () => {
          this.processLoadPixKeysComplete();
        }
      }); 
    }    
  }  

  private processLoadPixKeysSucess(response: any) {
    this.pixKeys = response.data.pixKeys;
    this.currentPage = response.data.page;
    this.totalPages = Math.ceil(response.data.totalRecords / response.data.pageSize);
  }

  private processLoadPixKeysFail(error: any) {
    this.loadingKeys = false;
    this.errorMessage = error.error.errors[0];
    this.toastr.error('Ocorreu um erro.', 'Atenção');
    this.spinner.hide();
  }

  private processLoadPixKeysComplete() {
    this.loadingKeys = false;
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

  addPixKey(){
    this.pixKeyService.clearLocalCurrentPageList();
    this.pixKeyService.clearLocalSearchTerm();
    this.router.navigate(['/pixkey/new']);
  }

  editPixKey(pixKey: PixKey) {
    this.pixKeyService.saveLocalCurrentPageList(this.currentPage);
    this.pixKeyService.saveLocalSearchTerm(this.searchTerm);
    this.router.navigate(['/pixkey/edit', pixKey.id]);
  }

  openDeleteModal(template: TemplateRef<any>, pixKey : PixKey) {
    this.selectedPixKey = pixKey;
    this.bsModalRef = this.modalService.show(template, this.selectedPixKey);
  }

  confirmDelete(pixKey: PixKey): void {  
    this.pixKeyService.deletePixKey(pixKey.id).subscribe({
      next: success => {
        this.processSuccessDelete(success, pixKey);
      },
      error: error => {
        this.processFailDelete(error);
      }
    });
  }

  processSuccessDelete(response: any, pixKey: PixKey) {
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

  processFailDelete(fail: any) {
    this.toastr.error('Ocorreu um erro.', 'Atenção');
  }

  onSearch(event: { pageSize: number, term: string }): void {
    this.pageSize = event.pageSize;
    this.searchTerm = event.term;
    this.currentPage = 1;
    this.pixKeyService.saveLocalSearchTerm(this.searchTerm);

    this.loadPixKeys();
  }

  clearSearch(): void {
    if (this.pixKeyService.getLocalSearchTerm() === '')
      return;

    this.searchTerm  = '';
    this.currentPage = 1;
    this.pixKeyService.clearLocalSearchTerm();
    this.loadPixKeys();
  }
}