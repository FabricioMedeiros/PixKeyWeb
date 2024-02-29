import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PixkeyAppComponent } from './pixkey.app.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { DeleteComponent } from './delete/delete.component';

const routes: Routes = [
  {
      path: '', component: PixkeyAppComponent,
      children: [
          { path: 'list', component: ListComponent},
          { path: 'new', component: FormComponent},
          { path: 'edit/:id', component: FormComponent},
          { path: 'delete:id', component: DeleteComponent}
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PixkeyRoutingModule { }
