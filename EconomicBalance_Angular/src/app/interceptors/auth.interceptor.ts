import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const reqClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(reqClonada);
  }

  return next(req);
};
