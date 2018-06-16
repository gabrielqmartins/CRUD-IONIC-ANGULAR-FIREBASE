import { AuthProvider } from './../../providers/auth/auth';
import { UserProvider } from './../../providers/user/user';

import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { Relatorios } from '../../models/relatorios.model';

import { RelatoriosPages } from '../relatorios/relatorios';

import { Observable } from 'rxjs/Observable';
import { RelatoriosProvider } from '../../providers/relatorios/relatorios';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  view: string = 'relatorios';

  relatorios: Observable<Relatorios[]>;

  public relatoriosPage = RelatoriosPages;

  constructor(
    public authProvider: AuthProvider,
    public navCtrl: NavController,
    public userProvider: UserProvider,
    public menuController: MenuController,
    public RelatoriosProvider: RelatoriosProvider) {
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  ionViewDidLoad() {
    // habilita o menu depois que usuário estiver logado
    this.menuController.enable(true, 'user-menu');

    this.relatorios = this.RelatoriosProvider.mapListKeys<Relatorios>(this.RelatoriosProvider.relatorio);
  }

  onRelatoriosOpen(relatorios: Relatorios): void {
    this.navCtrl.push(RelatoriosPages, {
      relatorios
    });
  }

  onLogout(): void {
    this.authProvider.logout();
  }

}
