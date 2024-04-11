import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { LocalStorageUtils } from '../utils/localstorage';
import { Router } from '@angular/router';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    localStorageUtil = new LocalStorageUtils();

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError(error => {
            if (error instanceof HttpErrorResponse) {

                if (error.status === 0) {
                    this.router.navigate(['/service-unavailable']);
                } else if (error.status === 401) {
                    this.localStorageUtil.clearLocalUserData();
                    this.router.navigate(['/account/login'], {queryParams: {returnUrl: this.router.url}});
                }

                throw error;
            }

            throw error;
        }));
    }

}
