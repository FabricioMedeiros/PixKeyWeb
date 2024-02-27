import { CanActivateFn, CanDeactivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { RegisterComponent } from "../register/register.component";
import { LocalStorageUtils } from "../../utils/localstorage";
import { inject } from "@angular/core";

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