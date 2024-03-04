import { Injectable } from "@angular/core";
import { BaseService } from "../../services/base.service";
import { HttpClient } from "@angular/common/http";
import { PixKey } from "../models/pixkey";
import { Observable, catchError } from "rxjs";

@Injectable()
export class PixKeyService extends BaseService {

    constructor(private http: HttpClient) { super(); }

    getAll(): Observable<PixKey[]> {
        const headers = this.GetAuthHeaderJson();

        return this.http
            .get<PixKey[]>(this.UrlServiceV1 + "pixkey", headers)
            .pipe(catchError(super.serviceError));
    }

}