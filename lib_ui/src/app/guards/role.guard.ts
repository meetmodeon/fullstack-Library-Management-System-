import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';
import { AuthServiceService } from '../services/auth/auth-service.service';

const authService=inject(AuthServiceService);
export const roleGuard: CanActivateChildFn = (childRoute, state) => {
  if(authService.getUserRoles().includes('ROLE_ADMIN')){
    return true;
  }
  return false;
};
