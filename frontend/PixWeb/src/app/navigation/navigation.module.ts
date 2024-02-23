import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { MenuLoginComponent } from './menu-login/menu-login.component';

@NgModule({
  declarations: [HomeComponent, MenuComponent, FooterComponent, NotFoundComponent, MenuLoginComponent],
  imports: [CommonModule, RouterModule],
  exports: [HomeComponent, MenuComponent, FooterComponent, NotFoundComponent],
})
export class NavigationModule {}
