import { CanActivateFn, CanDeactivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras } from "@angular/router";
import { inject } from "@angular/core";
import { FormComponent } from "../form/form.component";
import { LocalStorageUtils } from "src/app/utils/localstorage";

export const canActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const localStorageUtils = inject(LocalStorageUtils);
  const router = inject(Router);

  if (!localStorageUtils.getTokenUser()) {
    router.navigate(['/account/login'], {queryParams: { returnUrl: state.url}});
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