import { BaseService } from '../base.service';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';

import { Relatorios } from '../../models/relatorios.model';

import { Observable } from 'rxjs/Observable';

import { Subscriber } from 'rxjs';

import * as firebase from 'firebase/app';


/*
  Generated class for the TabalhoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RelatoriosProvider extends BaseService {

  relatorio: AngularFireList<Relatorios>;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase
  ) {
    super();
    this.getRelatorios();
    console.log('Hello RelatoriosProvider Provider');
  }

  private getRelatorios(): void {
    console.log("Consulta todos os relatorios");
    this.afAuth.authState
      .subscribe((authUser: firebase.User) => {
        if (authUser) {
          this.relatorio = this.db.list<Relatorios>(`/relatorios/${authUser.uid}`,
            (ref: firebase.database.Reference) => ref.orderByChild('timestamp')
          );
        }
      });
  }

  getNewId(): string {  
    return new Date().toString();
  }

  create(relatorios: Relatorios, uid: string): Promise<void> {
    relatorios.id = this.getNewId();
    console.log(relatorios.id);
    return this.db.object<Relatorios>(`/relatorios/${uid}/${relatorios.id}`)
      .set(relatorios)
      .catch(this.handlePromiseError);
  }

  edit(relatorios: Relatorios, uid: string): Promise<void> {
    return this.db.object<Relatorios>(`/relatorios/${uid}/${relatorios.id}`)
      .update({ titulo: relatorios.titulo, descricao: relatorios.descricao, aluno1: relatorios.aluno1, aluno2: relatorios.aluno2 })
      .catch(this.handlePromiseError);
  }

  remove(relatorios: Relatorios, uid: string): Promise<void> {
    return this.db.list<Relatorios>(`/relatorios/${uid}`)
      .remove(relatorios.id.toString())
      .catch(this.handlePromiseError);
  }
}
