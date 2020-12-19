import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor() { }

  fnSuccess(title:String,msg:string){
    Swal.fire({
      icon: 'success',
      title: title,
      text: msg,
      timer: 2500,
      showConfirmButton: false,
    });
  }

  fnSimple(){
    Swal.fire('Sesion Terminada');
  }

  fnError(title:string,msg:string){
    Swal.fire({
      icon: 'error',
      title: title,
      text: msg,
      timer: 2500,
      showConfirmButton: false,
    });
  }

  fnWarning(title:string,msg:string){
    Swal.fire(
      title,
      msg,
      'warning'
    )
  }
}
