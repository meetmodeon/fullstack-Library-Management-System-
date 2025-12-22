import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthServiceService } from '../services/auth/auth-service.service';
import { catchError,  throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService=inject(AuthServiceService);
  const router=inject(Router);

  let authReq=req;
  const url=req.url;
  

  if(url.includes("/login") || url.includes("/signIn")){
    return next(authReq);
  }
  const token=authService.getToken();
  if (token!==null) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/'])
      }
      return throwError(() => error);
    })
  );
  
}
