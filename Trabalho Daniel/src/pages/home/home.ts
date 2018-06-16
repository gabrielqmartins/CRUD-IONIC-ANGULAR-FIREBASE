import { AuthProvider } from './../../providers/auth/auth';
import { UserProvider } from './../../providers/user/user';

import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { Trabalho } from '../../models/trabalho.model';

import { TrabalhoPage } from '../trabalho/trabalho';

import { Observable } from 'rxjs/Observable';
import { TrabalhoProvider } from '../../providers/trabalho/trabalho';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  view: string = 'trabalho';

  trabalhos: Observable<Trabalho[]>;

  public trabalhoPage = TrabalhoPage;

  constructor(
    public authProvider: AuthProvider,
    public navCtrl: NavController,
    public userProvider: UserProvider,
    public menuController: MenuController,
    public trabalhoProvider: TrabalhoProvider) {
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  ionViewDidLoad() {
    // habilita o menu depois que usuário estiver logado
    this.menuController.enable(true, 'user-menu');

    this.trabalhos = this.trabalhoProvider.mapListKeys<Trabalho>(this.trabalhoProvider.trabalhos);
  }

  onTrabalhoOpen(trabalho: Trabalho): void {
    this.navCtrl.push(TrabalhoPage, {
      trabalho
    });
  }

  onLogout(): void {
    this.authProvider.logout();
  }

}
