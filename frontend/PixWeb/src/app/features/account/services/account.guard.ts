import { CanActivateFn, CanDeactivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";

import { RegisterComponent } from "../register/register.component";
import { LocalStorageUtils } from "src/app/utils/localstorage";

export const canActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const localStorageUtils = inject(LocalStorageUtils);
  const router = inject(Router);
  if (localStorageUtils.getTokenUser()) {
    router.navigate(['/home']);
    return false;
  }
  return true;
};

export const canDeactivate: CanDeactivateFn<RegisterComponent> = (component: RegisterComponent, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  if (!component.changesSaved) {
    return window.confirm('Tem certeza que deseja abandonar o preenchimento do cadastro?');
  }
  return true;
};