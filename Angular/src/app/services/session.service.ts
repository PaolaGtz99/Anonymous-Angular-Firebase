import { Router } from '@angular/router';
import { UsuarioModel } from './../modelos/usuario.model';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  
  private $user:BehaviorSubject<UsuarioModel> = new BehaviorSubject<UsuarioModel>({} as UsuarioModel);
  _user:Observable<UsuarioModel> = this.$user.asObservable()

  constructor(
    private storeService:FirestoreService,
    private router:Router
  ) {
    this.fnGetSession();
  }

  fnGetSession(){
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$user.next({} as UsuarioModel);
        this.storeService.fnGetElementById('usuario','uid',user.uid)
        .then((querySnapshot:any)=>{
          querySnapshot.forEach((doc) => {
            this.$user.next(doc.data())
            //this.router.navigate(['/estudiante'])
          });
        })
        
      } else {
        
        this.$user.next({} as UsuarioModel);
        this.router.navigate(['/home'])
      }
    });
  }

  fnGetLoged(){
    return this.$user.getValue();
  }
}
