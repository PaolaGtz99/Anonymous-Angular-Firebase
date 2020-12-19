import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth) { }

  fnFirebaseLogin(email: string, password: string):Promise<any>{
    return new Promise((resolve)=>{
      this.afAuth.signInWithEmailAndPassword(email, password)
      .then(res=>{
        resolve(true)
      })
      .catch(error=>{
        resolve(false)
      })
    })
  }

  async login(email: string, password: string) {
    try {
      const res = await this.afAuth.signInWithEmailAndPassword(email, password);
      return res;
    }
    catch (error) { console.log(error); }
  }

  async register(email: string, password: string) {
    try {
      const res = await this.afAuth.createUserWithEmailAndPassword(email, password);
      return res;
    }
    catch (error) { }
  }

  fnRegister(email:string,pass:string){
    return new Promise((resolve)=>{
      this.afAuth.createUserWithEmailAndPassword(email, pass)
      .then((res:firebase.auth.UserCredential)=>{
        resolve(res.user.uid)
      })
      .catch((error)=>{
        console.log(error)
        resolve(null);
      })
    })
  }

  async logout() {
    try {
      await this.afAuth.signOut();
    }
    catch (error) { console.log(error); }
  }

}
