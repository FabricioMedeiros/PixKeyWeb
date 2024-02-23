import { jwtDecode } from "jwt-decode";
import { JwtToken } from "../account/models/jtw.token";

export class LocalStorageUtils {

    public getUser() {
        const userJson = localStorage.getItem('pixweb.user');
        return userJson ? JSON.parse(userJson) : null;
    }

    public saveLocalUserData(response: any) {
        if (response && response.token) {
            this.saveTokenUser(response.token);
    
            try {
                const decodedToken = jwtDecode<JwtToken>(response.token);
            
                this.saveUser(decodedToken.username);
                this.saveEmailUser(decodedToken.email);
            } catch (error) {
                console.error('Erro ao decodificar o token:', error);
            }
        } else {
            console.error('Token inválido:', response);
        }
    }    

    public clearLocalUserData() {
        localStorage.removeItem('pixweb.token');
        localStorage.removeItem('pixweb.user');
        localStorage.removeItem('pixweb.email');
    }

    public getTokenUser(): string | null {
        return localStorage.getItem('pixweb.token');
    }

    public getEmailUser(): string | null {
        return localStorage.getItem('pixweb.email');
    }

    public saveTokenUser(token: string) {
        localStorage.setItem('pixweb.token', token);
    }

    public saveUser(user: string) {
        localStorage.setItem('pixweb.user', JSON.stringify(user));
    }

    public saveEmailUser(email: string) {
        localStorage.setItem('pixweb.email', JSON.stringify(email));
    }

}