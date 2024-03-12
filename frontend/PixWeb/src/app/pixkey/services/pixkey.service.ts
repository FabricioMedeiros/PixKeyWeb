import { Injectable } from "@angular/core";
import { BaseService } from "../../services/base.service";
import { HttpClient } from "@angular/common/http";
import { PixKey } from "../models/pixkey";
import { Observable, catchError, map } from "rxjs";

@Injectable()
export class PixKeyService extends BaseService {

    constructor(private http: HttpClient) { super(); }

    getAllPixKeys(): Observable<PixKey[]> {
        const headers = this.GetAuthHeaderJson();

        return this.http
            .get<PixKey[]>(this.UrlServiceV1 + "pixkey", headers)
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

    deletePixKey(id: string): Observable<any> {
        const headers = this.GetAuthHeaderJson();

        return this.http
            .delete(`${this.UrlServiceV1}pixkey/${id}`, headers)
            .pipe(catchError(super.serviceError));
    }

}