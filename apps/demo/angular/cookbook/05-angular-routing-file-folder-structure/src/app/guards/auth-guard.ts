import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';

import { Auth } from '../interfaces/auth.interface';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const auth = localStorage.getItem('auth');
  const toJson = auth ? JSON.parse(auth) : null;
  const accessToken = toJson?.accessToken as Auth['accessToken'];

  if (!accessToken) {
    const loginPath = router.parseUrl('/login');
    return new RedirectCommand(loginPath);
  }

  const me = await authService.me(accessToken);

  if (me) return true;

  return false;
};
