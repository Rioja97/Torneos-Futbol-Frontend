import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const loginGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  if (token) {
    // Si ya hay sesión iniciada, redirigir a home
    router.navigate(['/home']);
    return false;
  } else {
    // Si no hay token, permitir acceso al login
    return true;
  }
};
