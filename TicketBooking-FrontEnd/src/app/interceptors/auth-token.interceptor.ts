import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token=localStorage.getItem('token')
  const clonedReq=req.clone({
    setHeaders:{
      Authorization:`Bearer ${token}`
    }
  })

  return next(clonedReq);
};
