import { PixKeyService } from './../services/pixkey.service';
import { Component, OnInit } from '@angular/core';
import { PixKey } from '../models/pixkey';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  
  public pixKeys: PixKey[] = [];;
  errorMessage: string = '';

  constructor(private pixKeyService: PixKeyService, private router: Router) { }

  ngOnInit(): void {
    this.pixKeyService.getAllPixKeys().subscribe({
      next: pixKeys => {
        this.pixKeys = pixKeys;
      },
      error: error => {
        this.errorMessage = error;
      },
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
    this.router.navigate(['/pixkey/edit', pixKey.id]);
  }

}
