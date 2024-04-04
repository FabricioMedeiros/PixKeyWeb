import { CanActivateFn, CanDeactivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { LocalStorageUtils } from "../../utils/localstorage";
import { inject } from "@angular/core";
import { FormComponent } from "../form/form.component";

export const canActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const localStorageUtils = inject(LocalStorageUtils);
  const router = inject(Router);

  if (!localStorageUtils.getTokenUser()) {
    router.navigate(['/home']);
    return false;
  }
  
  return true;
};

export const canDeactivate: CanDeactivateFn<FormComponent> = (component: FormComponent, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  if (!component.changesSaved) {
    return window.confirm('Tem certeza que deseja abandonar o preenchimento do cadastro?');
  }
  return true;
};