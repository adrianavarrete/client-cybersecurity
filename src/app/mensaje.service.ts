import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  constructor(private http: HttpClient) { }

  readonly URL = 'http://localhost:8000';


  enviarMensaje(mensaje: any) {

    return this.http.post(this.URL + '/hola', {
      mensaje
    });
  }

  firmaCiega(mensaje: any) {

    return this.http.post(this.URL + '/blindSign', {
      mensaje
    });
  }

  enviarBNoRepudio(mensaje: any) {

    return this.http.post(this.URL + '/mensaje1NoRepudio', {
      mensaje
    });
  }

  dameClave() {
    return this.http.get(this.URL + '/key');
  }

}
