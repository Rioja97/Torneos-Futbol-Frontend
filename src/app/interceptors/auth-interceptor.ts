import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorHandlerService } from '../services/error-handler.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('authToken');
  const errorHandler = inject(ErrorHandlerService);
  const router = inject(Router);

  let clonedReq = req;

  if(token){
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`      
      }
    });
  }

  return next(clonedReq).pipe(
    catchError(error => {
      // Manejar el error globalmente
      errorHandler.handleError(error);

      // Si es 401, redirigir a login
      if (error.status === 401) {
        localStorage.removeItem('authToken');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};

