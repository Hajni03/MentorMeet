import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = localStorage.getItem('user');

  if (user) {
    // Ha van user, mehet az oldalra
    return true;
  } else {
    // Ha nincs user, visszadobjuk a loginra
    router.navigate(['/login']);
    return false;
  }
};