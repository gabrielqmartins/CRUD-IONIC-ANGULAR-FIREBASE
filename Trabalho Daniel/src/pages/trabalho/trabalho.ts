import { TrabalhoProvider } from './../../providers/trabalho/trabalho';
import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { User } from './../../models/user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Trabalho } from '../../models/trabalho.model';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-trabalho',
  templateUrl: 'trabalho.html',
})
export class TrabalhoPage {

  user: User;
  trabalho: Trabalho;

  trabalhoForm: FormGroup;

  constructor(
    public authProvider: AuthProvider,
    public trabalhoProvider: TrabalhoProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public userProvider: UserProvider) {

  }

  ionViewWillLoad() {
    this.trabalho = this.navParams.get('trabalho');
    if (!this.trabalho) {
      this.trabalho = new Trabalho('', '', '', '', '');
    }

    this.trabalhoForm = this.formBuilder.group({
      titulo: [this.trabalho.titulo, [Validators.required, Validators.minLength(3)]],
      descricao: [this.trabalho.descricao, [Validators.required, Validators.minLength(3)]],
      aluno1: [this.trabalho.aluno1, [Validators.required, Validators.minLength(3)]],
      aluno2: [this.trabalho.aluno2, [Validators.required, Validators.minLength(3)]]
    });
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    return loading;
  }

  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();
  }

  onSubmit(): void {
    let loading: Loading = this.showLoading();
    let form = this.trabalhoForm.value;
    this.trabalho.titulo = form.titulo;
    this.trabalho.descricao = form.descricao;
    this.trabalho.aluno1 = form.aluno1;
    this.trabalho.aluno2 = form.aluno2;

    this.userProvider.mapObjectKey<User>(this.userProvider.currentUser)
      .first()
      .subscribe((currentUser: User) => {
        if (!this.trabalho.$key) {
          this.trabalhoProvider.create(this.trabalho, currentUser.$key)
            .then(() => {
              console.log('Trabalho cadastrado!');
              this.navCtrl.setRoot(HomePage);
              loading.dismiss();
              this.showAlert(`Trabalho cadastrado!`);
            })
            .catch(err => {
              console.log(err);
              loading.dismiss();
              this.showAlert(`Erro ao cadastrar trabalho! ${err.message}`);
            });
        } else {
          this.trabalhoProvider.edit(this.trabalho, currentUser.$key)
            .then(res => {
              console.log('Trabalho editado!');
              //this.navCtrl.setRoot(HomePage);
              loading.dismiss();
              this.showAlert(`Trabalho editado!`);
            })
            .catch(err => {
              console.log(err);
              loading.dismiss();
              this.showAlert(`Erro ao editar trabalho! ${err.message}`);
            });
        }
      });
  }

  delete() {
    let loading: Loading = this.showLoading();
    let form = this.trabalhoForm.value;
    this.trabalho.titulo = form.titulo;
    this.trabalho.descricao = form.descricao;
    this.trabalho.aluno1 = form.aluno1;
    this.trabalho.aluno2 = form.aluno2;

    this.userProvider.mapObjectKey<User>(this.userProvider.currentUser)
      .first()
      .subscribe((currentUser: User) => {
        this.trabalhoProvider.remove(this.trabalho, currentUser.$key)
          .then(() => {
            console.log('Trabalho deletado!');
            this.navCtrl.setRoot(HomePage);
            loading.dismiss();
            this.showAlert(`Trabalho deletado!`);
          })
          .catch(err => {
            console.log(err);
            loading.dismiss();
            this.showAlert(`Erro ao excluir trabalho! ${err.message}`);
          });
      });
  }

}
