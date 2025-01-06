import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/navigation/home/home.component';
import { NotFoundComponent } from './features/navigation/not-found/not-found.component';
import { ServiceUnavailableComponent } from './features/navigation/service-unavailable/service-unavailable.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'account', loadChildren: () => import('./features/account/account.module').then(m => m.AccountModule)},
  { path: 'pixkey', loadChildren: () => import('./features/pixkey/pixkey.module').then(m => m.PixkeyModule)},
  { path: 'service-unavailable', component: ServiceUnavailableComponent },
  { path: '**', component: NotFoundComponent },
  { path: 'not-found', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
