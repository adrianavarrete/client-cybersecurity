import { Component, OnInit } from '@angular/core';
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
  publicKey: any;
  privateKey: any;
  serverPublicKey: any;

  mensaje: any

  constructor(private mensajeService: MensajeService) { }

  async ngOnInit() {
    this.claves()
    this.dameClave()
  }

  enviarMensaje(form: NgForm) {
    this.mensaje = new Mensaje(bigconv.bigintToHex(rsa.encrypt(bigconv.textToBigint(form.value.mensajeHTML), this.serverPublicKey[0], this.serverPublicKey[1])), bigconv.bigintToHex(this.publicKey.e), bigconv.bigintToHex(this.publicKey.n))
    this.mensajeService.enviarMensaje(this.mensaje)
      .subscribe((res: any) => {
        this.respuesta = bigconv.bigintToText(rsa.decrypt(bigconv.hexToBigint(res.respuestaServidor), this.privateKey.d, this.privateKey.publicKey.n));

      })
  }

  async claves() {
    const { publicKey, privateKey } = await rsa.generateRandomKeys(3072);
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  dameClave() {
    this.mensajeService.dameClave().subscribe((res: any) => {
      this.serverPublicKey = [bigconv.hexToBigint(res.e), bigconv.hexToBigint(res.n)]
    })
  }

}
