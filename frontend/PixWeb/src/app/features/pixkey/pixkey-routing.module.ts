import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PixkeyAppComponent } from './pixkey.app.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { DeleteComponent } from './delete/delete.component';
import { pixKeyResolver } from './services/pixkey.resolve';
import { canActivate, canDeactivate } from './services/pixkey.guard';

const routes: Routes = [
  {
      path: '', component: PixkeyAppComponent,
      children: [
          { path: 'list', component: ListComponent, canActivate: [canActivate]},
          { path: 'new', component: FormComponent, canActivate: [canActivate], canDeactivate: [canDeactivate]},
          { path: 'edit/:id', component: FormComponent, canActivate: [canActivate], canDeactivate: [canDeactivate], resolve: { pixKey: pixKeyResolver }},
          { path: 'delete:id', component: DeleteComponent}
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PixkeyRoutingModule { }
