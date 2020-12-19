import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()

export class MessageService {

constructor(private http: HttpClient) { }

sendMessage(body) {
 return this.http.post('https://login-ng-a48bf.web.app/formulario', body);
 }
}
