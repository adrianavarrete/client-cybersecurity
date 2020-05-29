import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaillierPageRoutingModule } from './paillier-routing.module';

import { PaillierPage } from './paillier.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaillierPageRoutingModule
  ],
  declarations: [PaillierPage]
})
export class PaillierPageModule {}
