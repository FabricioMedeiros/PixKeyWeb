import { Observable, catchError, map } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user";
import { BaseService } from '../../services/base.service';

@Injectable()
export class AccountService extends BaseService {

    constructor(private http: HttpClient) { super(); }

    registerUser(user: User) : Observable<User> {
        let response = this.http
            .post(this.UrlServiceV1 + 'auth/register', user, this.GetHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    login(user: User) : Observable<User> {
        let response = this.http
            .post(this.UrlServiceV1 + 'auth/login', user, this.GetHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }
}