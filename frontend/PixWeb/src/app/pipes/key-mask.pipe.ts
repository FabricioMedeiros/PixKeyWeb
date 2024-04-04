import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyMask'
})
export class KeyMaskPipe implements PipeTransform {
  transform(key: string, keyType: number): string {
    if (!key) return '';

    switch (keyType) {
      case 0:
        return this.applyCPFOrCNPJMask(key);
      case 1:
        return key; 
      case 2:
        return this.applyPhoneMask(key);
      case 3:
        return this.applyRandomMask(key);
      default:
        return key;
    }
  }

  private applyCPFOrCNPJMask(key: string): string {
    if (key.length <= 11) {
      return this.applyCPFMask(key);
    } else {
      return this.applyCNPJMask(key);
    }
  }

  private applyCPFMask(cpf: string): string {
    cpf = cpf.replace(/\D/g, ''); 

    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  private applyCNPJMask(cnpj: string): string {
    cnpj = cnpj.replace(/\D/g, ''); 

    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  private applyPhoneMask(phone: string): string {
    phone = phone.replace(/\D/g, ''); 

    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  private applyRandomMask(key: string): string {
    // Verifica se a chave tem o formato esperado de 32 caracteres
    if (key.length !== 32) {
        return key; // Se não tiver o formato esperado, retorna a chave sem modificação
    }

    // Divide a chave em quatro grupos de caracteres
    const groups = [
        key.slice(0, 8),
        key.slice(8, 12),
        key.slice(12, 16),
        key.slice(16, 20),
        key.slice(20)
    ];

    // Concatena os grupos usando hífens como separadores
    return groups.join('-');
}

}
