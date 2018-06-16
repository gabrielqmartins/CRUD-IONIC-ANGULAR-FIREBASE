import { BaseService } from '../base.service';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';

import { Trabalho } from '../../models/trabalho.model';

import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs';
/*
  Generated class for the TabalhoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TrabalhoProvider extends BaseService {

  trabalhos: AngularFireList<Trabalho>;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase
  ) {
    super();
    this.getTrabalhos();
    console.log('Hello TrabalhoProvider Provider');
  }

  private getTrabalhos(): void {
    console.log("Consulta todos os trabalhos");
    this.afAuth.authState
      .subscribe((authUser: firebase.User) => {
        if (authUser) {
          this.trabalhos = this.db.list<Trabalho>(`/trabalhos/${authUser.uid}`,
            (ref: firebase.database.Reference) => ref.orderByChild('timestamp')
          );
        }
      });
  }

  getNewId(): string {  
    return new Date().toString();
  }

  create(trabalho: Trabalho, uid: string): Promise<void> {
    trabalho.id = this.getNewId();
    console.log(trabalho.id);
    return this.db.object<Trabalho>(`/trabalhos/${uid}/${trabalho.id}`)
      .set(trabalho)
      .catch(this.handlePromiseError);
  }

  edit(trabalho: Trabalho, uid: string): Promise<void> {
    return this.db.object<Trabalho>(`/trabalhos/${uid}/${trabalho.id}`)
      .update({ titulo: trabalho.titulo, descricao: trabalho.descricao, aluno1: trabalho.aluno1, aluno2: trabalho.aluno2 })
      .catch(this.handlePromiseError);
  }

  remove(trabalho: Trabalho, uid: string): Promise<void> {
    return this.db.list<Trabalho>(`/trabalhos/${uid}`)
      .remove(trabalho.id.toString())
      .catch(this.handlePromiseError);
  }
}
