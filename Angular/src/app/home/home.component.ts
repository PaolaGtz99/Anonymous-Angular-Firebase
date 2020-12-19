import { Router } from '@angular/router';
import { FeedbackService } from 'src/app/services/feedback.service';
import { UsuarioModel } from './../modelos/usuario.model';
import { SessionService } from './../services/session.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private sessionService:SessionService,
    private feedbackService:FeedbackService
  ) { }

  ngOnInit(): void {
  }
  
  irPerfil(){
    let user:UsuarioModel = this.sessionService.fnGetLoged();
    console.log(user)
    if(user.uid){
      console.log(`/${this.sessionService.fnGetLoged().tipoUsuario}`)
      this.router.navigate([`/${this.sessionService.fnGetLoged().tipoUsuario}`]);
    }else{
      this.feedbackService.fnWarning(
        'Inicia Sesion',
      'Tienes que iniciar sesion',
      )
    }
  }

}
