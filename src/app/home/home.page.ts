import { Component, OnInit} from '@angular/core';
import { MensajeService } from '../mensaje.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  respuesta: any;

  constructor(private mensajeService: MensajeService) {}

  ngOnInit() {

  }

  enviarMensaje(form: NgForm){
    this.mensajeService.enviarMensaje(form.value.mensaje)
      .subscribe((res: any)=> {
        console.log(res)
        this.respuesta = res.respuestaServidor;

      })
  }

}
