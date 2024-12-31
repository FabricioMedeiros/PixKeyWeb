import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { LocalStorageUtils } from '../utils/localstorage';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router,
        private toastr: ToastrService
    ) { }

    localStorageUtil = new LocalStorageUtils();

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError(error => {
            if (error instanceof HttpErrorResponse) {

                if (error.status === 0) {
                    this.router.navigate(['/service-unavailable']);
                } else if (error.status === 401) {
                    this.localStorageUtil.clearLocalUserData();

                    this.toastr.clear();
                    this.toastr.warning('Sessão encerrada. Faça login novamente.', 'Atenção');
                    this.router.navigate(['/account/login'], { queryParams: { returnUrl: this.router.url } });

                    return throwError(() => new HttpErrorResponse({
                        error: { message: 'Sessão encerrada.' },
                        status: 401,
                        statusText: 'Unauthorized'
                    }));
                }

                throw error;
            }

            throw error;
        }));
    }

}
