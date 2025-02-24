import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../Services/auth-service.service';
import { ToasterService } from '../Services/toaster.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService=inject(AuthServiceService);
  const Toast=inject(ToasterService);
  const router=inject(Router);
  if(authService.currentUser && (authService.currentUser.role ==='admin' || authService.currentUser.role ==='Admin')){
    return true;
  }
  Toast.showToast('warn',"No Access for you");
  router.navigateByUrl("/");
  return false;
};
