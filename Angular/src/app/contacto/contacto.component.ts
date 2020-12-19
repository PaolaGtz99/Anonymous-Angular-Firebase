import { FeedbackService } from './../services/feedback.service';
import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import {FormControl, Validators, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  constructor(private msgServ: MessageService, private feedback: FeedbackService) {

  }

  value = '';
  form;

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
  }

  contactForm(form) {
    this.msgServ.sendMessage(form).subscribe(() => {
    this.feedback.fnSuccess('Exito', 'Tu Mensaje fue enviado');
    this.form.reset();
    });
    }
}
