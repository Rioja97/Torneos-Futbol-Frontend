import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/authService';

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  } else {
    // Redirigir a home si no es admin
    router.navigate(['/home']);
    return false;
  }
};
