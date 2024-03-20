import { AbstractControl, ValidationErrors } from "@angular/forms";

export function documentValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.replace(/\D/g, ''); // Remove caracteres não numéricos

    let valueLength = value.length;

    if (valueLength === 11) {
        return cpfValidator(control);
    }
    else {
        return cnpjValidator(control);
    }
}

function cpfValidator(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value?.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cpf && cpf.length === 11) {
        let sum = 0;
        let remainder;

        // Verifica se todos os dígitos são iguais (inválido)
        if (cpf.split('').every((c: any) => c === cpf[0])) return { 'cpfInvalid': true };

        // Calcula o primeiro dígito verificador
        for (let i = 1; i <= 9; i++)
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);

        remainder = (sum * 10) % 11;

        if ((remainder === 10) || (remainder === 11)) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return { 'cpfInvalid': true };

        sum = 0;
        // Calcula o segundo dígito verificador
        for (let i = 1; i <= 10; i++)
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);

        remainder = (sum * 10) % 11;

        if ((remainder === 10) || (remainder === 11)) remainder = 0;
        if (remainder !== parseInt(cpf.substring(10, 11))) return { 'cpfInvalid': true };

        return null; // CPF válido
    }
    return null
}

function cnpjValidator(control: AbstractControl): ValidationErrors | null {
    const cnpj = control.value?.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cnpj && cnpj.length === 14) {
        let length = cnpj.length - 2
        let numbers = cnpj.substring(0, length);
        const digits = cnpj.substring(length);
        let sum = 0;
        let pos = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += numbers.charAt(length - i) * pos--;
            if (pos < 2) pos = 9;
        }

        let result = sum % 11 < 2 ? 0 : 11 - sum % 11;

        if (result !== parseInt(digits.charAt(0))) return { 'cnpjInvalid': true };

        length = length + 1;
        numbers = cnpj.substring(0, length);
        sum = 0;
        pos = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += numbers.charAt(length - i) * pos--;
            if (pos < 2) pos = 9;
        }

        result = sum % 11 < 2 ? 0 : 11 - sum % 11;

        if (result !== parseInt(digits.charAt(1))) return { 'cnpjInvalid': true };

        return null; // CNPJ válido
    }
    return null
}

