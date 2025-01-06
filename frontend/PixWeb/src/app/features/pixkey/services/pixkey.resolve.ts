import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { PixKey } from '../models/pixkey';
import { PixKeyService } from './pixkey.service';

export const pixKeyResolver: ResolveFn<PixKey> = (route: ActivatedRouteSnapshot) => {
  const pixKeyService = inject(PixKeyService);
  return pixKeyService.getPixKeyById(route.params['id']);
};
