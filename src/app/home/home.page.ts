import { Component, OnInit, ExistingSansProvider } from '@angular/core';
import { MensajeService } from '../mensaje.service';
import { Mensaje } from './Mensaje';
import { NgForm } from '@angular/forms';
import * as big from 'bigint-crypto-utils'
import * as rsa from 'rsa';
import * as bigconv from 'bigint-conversion'



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  respuesta: any;
  publicKey: rsa.PublicKey;
  privateKey: rsa.PrivateKey;
  serverPublicKey: rsa.PublicKey;

  mensaje: any

  constructor(private mensajeService: MensajeService) { }

  async ngOnInit() {
    this.claves()
    this.dameClave()
  }

  enviarMensaje(form: NgForm) {
    this.mensaje = new Mensaje(bigconv.bigintToHex(this.serverPublicKey.encrypt(bigconv.textToBigint(form.value.mensajeHTML))),bigconv.bigintToHex(this.publicKey.e), bigconv.bigintToHex(this.publicKey.n))

    this.mensajeService.enviarMensaje(this.mensaje)
      .subscribe((res: any) => {
        this.respuesta = bigconv.bigintToText(this.privateKey.decrypt(bigconv.hexToBigint(res.respuestaServidor)))

      });
  }

  async claves() {
    const { publicKey, privateKey } = await rsa.generateRandomKeys(3072);
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  dameClave() {
    this.mensajeService.dameClave().subscribe((res: any) => {
      this.serverPublicKey = new rsa.PublicKey(bigconv.hexToBigint(res.e),bigconv.hexToBigint(res.n))
    })
  }

}
