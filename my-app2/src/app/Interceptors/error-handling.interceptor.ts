import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs';

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {

  constructor(
    private toastrService: ToastrService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMsg = '';
            if (request.method === 'GET' && error.status === 0) {
                this.toastrService.error('Could not load the Machine Parameters. Please try again later!', '', {
                  timeOut: 10000,
                  extendedTimeOut: 3000,
                  positionClass: 'toast-top-center',
                  progressBar: true,
                });
                errorMsg = `Error Code: ${error.status}, Message: Could not load the Machine Parameters. Please try again later!`;
            } else {
              this.toastrService.error('Server Error!', '', {
                timeOut: 10000,
                extendedTimeOut: 3000,
                positionClass: 'toast-top-center',
                progressBar: true,
              });
                errorMsg = `Error Code: ${error.status},  Message: Server Error!`;
            }
            return throwError(errorMsg);
        })
    ) as Observable<HttpEvent<any>>;
  }
}
