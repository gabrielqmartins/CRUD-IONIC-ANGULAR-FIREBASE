import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RelatoriosPages } from './relatorios';

@NgModule({
  declarations: [
    RelatoriosPages,
  ],
  imports: [
    IonicPageModule.forChild(RelatoriosPages),
  ],
})
export class RelatoriosPagesModule {}
