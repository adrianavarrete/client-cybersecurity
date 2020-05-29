import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaillierPage } from './paillier.page';

const routes: Routes = [
  {
    path: '',
    component: PaillierPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaillierPageRoutingModule {}
