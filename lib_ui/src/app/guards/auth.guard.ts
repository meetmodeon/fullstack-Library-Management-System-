import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth/auth-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService=inject(AuthServiceService);
  const router=inject(Router);
  const isLoggedIn=authService.isLoggedIn();

  if(isLoggedIn){
    return true;
  }else{
    router.navigateByUrl('/');
    return false;
  }
};
