import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
    private toast: NgToastService,
    private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.authService.getToken();

    if (myToken){
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${myToken}`}
      })
    }

    return next.handle(request).pipe(
      catchError((err:any)=>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            this.toast.warning({detail:'WARNING', summary:'Token is expireg, Login again'});
            this.router.navigate(['/login']);
          }
        }
        return throwError(() => new Error('Some other Error occured!'))
      })
    );
  }
}
