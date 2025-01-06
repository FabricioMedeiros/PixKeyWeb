import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MenuLoginComponent } from './menu-login/menu-login.component';
import { ServiceUnavailableComponent } from './service-unavailable/service-unavailable.component';

@NgModule({
  declarations: [HomeComponent, MenuComponent, FooterComponent, NotFoundComponent, MenuLoginComponent, ServiceUnavailableComponent],
  imports: [CommonModule, RouterModule],
  exports: [HomeComponent, MenuComponent, FooterComponent, NotFoundComponent, ServiceUnavailableComponent],
})
export class NavigationModule {}
