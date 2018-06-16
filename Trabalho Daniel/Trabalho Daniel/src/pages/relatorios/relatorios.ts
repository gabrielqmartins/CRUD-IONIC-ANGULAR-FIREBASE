import { RelatoriosProvider } from './../../providers/relatorios/relatorios';
import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { User } from './../../models/user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Relatorios } from '../../models/relatorios.model';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-relatorios',
  templateUrl: 'relatorios.html',
})
export class RelatoriosPages {

  user: User;
  relatorios: Relatorios;

  relatoriosForm: FormGroup;

  constructor(
    public authProvider: AuthProvider,
    public RelatoriosProvider: RelatoriosProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public userProvider: UserProvider) {

  }

  ionViewWillLoad() {
    this.relatorios = this.navParams.get('relatorios');
    if (!this.relatorios) {
      this.relatorios = new Relatorios('', '', '', '', '');
    }

    this.relatoriosForm = this.formBuilder.group({
      titulo: [this.relatorios.titulo, [Validators.required, Validators.minLength(3)]],
      descricao: [this.relatorios.descricao, [Validators.required, Validators.minLength(3)]],
      aluno1: [this.relatorios.aluno1, [Validators.required, Validators.minLength(3)]],
      aluno2: [this.relatorios.aluno2, [Validators.required, Validators.minLength(3)]]
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
    let form = this.relatoriosForm.value;
    this.relatorios.titulo = form.titulo;
    this.relatorios.descricao = form.descricao;
    this.relatorios.aluno1 = form.aluno1;
    this.relatorios.aluno2 = form.aluno2;

    this.userProvider.mapObjectKey<User>(this.userProvider.currentUser)
      .first()
      .subscribe((currentUser: User) => {
        if (!this.relatorios.$key) {
          this.RelatoriosProvider.create(this.relatorios, currentUser.$key)
            .then(() => {
              console.log('Relatorio cadastrado!');
              this.navCtrl.setRoot(HomePage);
              loading.dismiss();
              this.showAlert(`Relatorio cadastrado!`);
            })
            .catch(err => {
              console.log(err);
              loading.dismiss();
              this.showAlert(`Erro ao cadastrar relatorios! ${err.message}`);
            });
        } else {
          this.RelatoriosProvider.edit(this.relatorios, currentUser.$key)
            .then(res => {
              console.log('Relatorio editado!');
              //this.navCtrl.setRoot(HomePage);
              loading.dismiss();
              this.showAlert(`Relatorio editado!`);
            })
            .catch(err => {
              console.log(err);
              loading.dismiss();
              this.showAlert(`Erro ao editar relatorios! ${err.message}`);
            });
        }
      });
  }

  delete() {
    let loading: Loading = this.showLoading();
    let form = this.relatoriosForm.value;
    this.relatorios.titulo = form.titulo;
    this.relatorios.descricao = form.descricao;
    this.relatorios.aluno1 = form.aluno1;
    this.relatorios.aluno2 = form.aluno2;

    this.userProvider.mapObjectKey<User>(this.userProvider.currentUser)
      .first()
      .subscribe((currentUser: User) => {
        this.RelatoriosProvider.remove(this.relatorios, currentUser.$key)
          .then(() => {
            console.log('Relatorio deletado!');
            this.navCtrl.setRoot(HomePage);
            loading.dismiss();
            this.showAlert(`Relatorio deletado!`);
          })
          .catch(err => {
            console.log(err);
            loading.dismiss();
            this.showAlert(`Erro ao excluir relatorios! ${err.message}`);
          });
      });
  }

}
