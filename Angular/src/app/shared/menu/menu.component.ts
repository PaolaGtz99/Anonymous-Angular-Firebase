import { SessionService } from './../../services/session.service';
import { UsuarioModel } from './../../modelos/usuario.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as firebase from 'firebase';
import { ErrorStateMatcher } from '@angular/material/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Observable } from 'rxjs';
import { SpeechService } from 'src/app/services/speech.service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {

  // tslint:disable-next-line: variable-name
  _email = '';
  // tslint:disable-next-line: variable-name
  _contra = '';
  tipoDeCuenta = 'estudiante';
  mostrarLectura = false;
  hide = true;
  hide2 = true;
  btn = '';
  contraDif = '';
  campos = '';
  contraMin = '';
  errMail = '';
  tipo = 'hola';
  muroTipo: string;
  spinner = false;
  index: number;
  v: number = this.getVolume();
  speechData: any;
  // tslint:disable-next-line: member-ordering
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  currentUser: Observable<UsuarioModel>;

  ngOnInit() {
  }

  constructor(
    private sessionService: SessionService,
    private storeService: FirestoreService,
    private feedback: FeedbackService,
    private authSvc: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private spk: SpeechService
  ) {
    this.currentUser = this.sessionService._user;
  }

  // L O G I N
  async iniciarSesion() {

    const email = (document.getElementById('emailLogin') as HTMLInputElement)
      .value;
    const pass = (document.getElementById('passLogin') as HTMLInputElement)
      .value;

    this.authSvc.fnFirebaseLogin(email, pass)
      .then(success => {
        if (success) {
          this.spinner = true;
          this._email = '';
          this._contra = '';
          setTimeout(() => {
            this.feedback.fnSuccess('Bienvenido', this.sessionService.fnGetLoged().nombre);
            this.muroTipo = this.sessionService.fnGetLoged().tipoUsuario;
            this.router.navigate([`/${this.muroTipo}`]);
            this.spinner = false;
          }, 2000);
        } else {
          this.feedback.fnError('Error', ' Usuario o Contraseña incorrectos');
        }
      });
  }

  // R E G I S T R A R S E

  async registro() {
    // Regitrar en bd
    console.log(this.tipo);
    const email = (document.getElementById('emailLogin') as HTMLInputElement)
      .value;
    const pass = (document.getElementById('passLogin') as HTMLInputElement)
      .value;
    const confirm = (document.getElementById('passLoginConfirm') as HTMLInputElement)
      .value;
    const name = (document.getElementById('nameLogin') as HTMLInputElement)
      .value;
    if (this.validacion(pass, confirm, email, name)) {
      try {
        this.authSvc.fnRegister(email, pass)
          .then((uid) => {
            // Si no obtenemos un uid (error en el alta)
            if (!uid) {
              this.feedback.fnError('Ups', 'Error en el email');
              return;
            }

            // Guardamos en db refrencia del usuario
            let obj = {
              email: email,
              nombre: name,
              uid: uid,
              tipoUsuario: this.tipoDeCuenta
            };
            this.spinner = true;
            this.storeService.fnAddCollection('usuario', obj)
              .then(success => {
                if (!success) {
                  // En caso de error al guar en db
                  this.feedback.fnError('Ups', 'Estamos teniendo algunos problemas intenta mas tarde');
                  this.spinner = false;
                } else {
                  // en caso de exito (proceso terminado correctamente)
                  this.feedback.fnSuccess('Bienvenido', 'Tu registro fue exitoso');
                  this.router.navigate([`/${this.sessionService.fnGetLoged().tipoUsuario}`]);
                  this.spinner = false;
                }
              });
          });
      } catch (error) {
        console.log(error);
      }
    }
  }

 // VALIDAR CAMPOS DE REGISTRO

  validacion(pass: string, confirm: string, email: string, nom: string) {
    this.contraDif = '';
    this.campos = '';
    this.contraMin = '';
    let bien = true;

    // contraseñas iguales
    if (pass != confirm) {
      this.contraDif = 'Las contraseñas no coinciden';
      bien = false;
    }
    // contraseñas mas de 5 caract
    if (pass.length < 6) {
      this.contraMin = 'Minimo de 6 caracteres';
      bien = false;
    }
    // campos vacios
    if (pass === '' || email === '' || nom === '') {
      this.campos = 'Campos Incompletos';
      bien = false;
    }

    return bien;
  }

  // tipo de cuenta
  cambiar() {
    if (this.tipoDeCuenta == 'estudiante') { this.tipoDeCuenta = 'maestro'; }
    else { this.tipoDeCuenta = 'estudiante'; }
  }

  Perfil() {
    this.router.navigate([`/${this.sessionService.fnGetLoged().tipoUsuario}`]);
  }

  fnLogout() {

    firebase.auth().signOut();
    this.feedback.fnSimple();
  }



  // A C C E S I B I L I D A D  W E B
  mostLec() {
    if (this.mostrarLectura) {
      this.mostrarLectura = false;
    } else {
      this.mostrarLectura = true;
    }
  }


  start(html) {
    this.spk.start(html);
  }
  pause() {
    this.spk.pause();
  }
  resume() {
    this.spk.resume();
  }

  getSpeechData() {
    this.speechData = this.spk.speechData;
  }

  setVolume(v) {
    this.spk.setVolume(v);
  }

  getVolume() {
    return this.spk.getVolume();
  }

  changeVoice() {
    // tslint:disable-next-line: no-unused-expression
    this , this.speechData = this.spk.getSpeechData();
  }

  setLanguage(lang) {
    this.spk.setLanguage(lang);
  }
}
