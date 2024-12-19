import { Injectable } from "@angular/core";
import { BaseService } from "../../services/base.service";
import { HttpClient } from "@angular/common/http";
import { PixKey } from "../models/pixkey";
import { Observable, catchError, map } from "rxjs";

@Injectable()
export class PixKeyService extends BaseService {

    constructor(private http: HttpClient) { super(); }

    getAllPixKeys(page: number, pageSize: number, field?: string, value?: string): Observable<any> {
        const headers = this.GetAuthHeaderJson();
        let url = `${this.UrlServiceV1}pixkey?page=${page}&pageSize=${pageSize}`;
    
        if (field && value) {
            url += `&field=${field}&value=${value}`;
        }
    
        return this.http
            .get<any>(url, headers)
            .pipe(catchError(super.serviceError));
    }    

    getPixKeyById(id: number): Observable<PixKey> {
        const headers = this.GetAuthHeaderJson();

        return this.http
            .get<PixKey>(`${this.UrlServiceV1}pixkey/${id}`, headers)
            .pipe(catchError(super.serviceError));
    }

    registerPixKey(pixKey: PixKey): Observable<PixKey> {
        const headers = this.GetAuthHeaderJson();

        let response = this.http
            .post(this.UrlServiceV1 + 'PixKey', pixKey, headers)
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    updatePixKey(pixKey: PixKey): Observable<PixKey> {
        let response = this.http
            .put(this.UrlServiceV1 + 'pixkey', pixKey, this.GetAuthHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    deletePixKey(id: number): Observable<any> {
        const headers = this.GetAuthHeaderJson();

        return this.http
            .delete(`${this.UrlServiceV1}pixkey/${id}`, headers)
            .pipe(catchError(super.serviceError));
    }

    saveLocalCurrentPageList(page: number): void {
        localStorage.setItem('currentPagePixKeyList', page.toString());
    }

    getLocalCurrentPageList(): string {
        return localStorage.getItem('currentPagePixKeyList') || '';
    }

    clearLocalCurrentPageList(): void {
        localStorage.removeItem('currentPagePixKeyList'); 
    }

    saveLocalSearchTerm(searchTerm: string): void {
        localStorage.setItem('searchTermPixKeyList', searchTerm);
    }

    getLocalSearchTerm(): string {
        return localStorage.getItem('searchTermPixKeyList') || '';
    }

    clearLocalSearchTerm(): void {
        localStorage.removeItem('searchTermPixKeyList'); 
    }
}