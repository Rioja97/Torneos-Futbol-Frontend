import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const token = localStorage.getItem('authToken');

  if(token){
    return true;
  } else {
    // Devolver una URL tree para redirigir sin causar loop
    return router.parseUrl('/login');
  }
};
