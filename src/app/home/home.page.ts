import { Component, OnInit, ExistingSansProvider } from '@angular/core';
import { MensajeService } from '../mensaje.service';
import { Mensaje } from './Mensaje';
import { NgForm } from '@angular/forms';
import * as big from 'bigint-crypto-utils'
import * as rsa from 'rsa';
import * as bigconv from 'bigint-conversion'
import { Observable, Observer } from 'rxjs';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  respuesta = new Observable<string>( (observer: Observer<string>) => {
    setInterval( () => {
      observer.next(this.res), 1000;
    })
  });
  res: string;
  publicKey: rsa.PublicKey;
  privateKey: rsa.PrivateKey;
  serverPublicKey: rsa.PublicKey;

  mensaje: any

  constructor(private mensajeService: MensajeService) { }

  async ngOnInit() {
    this.claves()
    this.dameClave()
  }

  async enviarMensaje(form: NgForm) {
    var m = this.serverPublicKey.encrypt(bigconv.textToBigint(form.value.mensajeHTML))
    
    this.mensaje = new Mensaje(bigconv.bigintToHex(m),bigconv.bigintToHex(this.publicKey.e), bigconv.bigintToHex(this.publicKey.n))

    this.mensajeService.enviarMensaje(this.mensaje)
      .subscribe((res: any) => {
        //this.respuesta = bigconv.bigintToText(this.privateKey.decrypt(bigconv.hexToBigint(res.respuestaServidor)))

      });
  }

  async firmaCiega(form: NgForm) {
    var r = await big.prime(3072);
    //var r = BigInt(Math.floor(Math.random() * 2000000) + 1  )
    var m = bigconv.textToBigint(form.value.mensajeHTML);
    

    var bm = this.blindMessage(m,r,this.serverPublicKey.e,this.serverPublicKey.n)
    
    this.mensaje = new Mensaje(bigconv.bigintToHex(bm),bigconv.bigintToHex(this.publicKey.e), bigconv.bigintToHex(this.publicKey.n))

    this.mensajeService.firmaCiega(this.mensaje)
      .subscribe((res: any) => {
        bm = this.verifyBlindSignature(bigconv.hexToBigint(res.respuestaServidor),r,this.serverPublicKey.e,this.serverPublicKey.n);
        this.res = bigconv.bigintToText(this.serverPublicKey.verify(bm))

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

  blindMessage(m: bigint, r: bigint, e: bigint, n: bigint){
    var ReModn = big.modPow(r,e,n);
    var bm = (m * ReModn) % n;

    return bm;

  }

  verifyBlindSignature(bs: bigint, r: bigint, e: bigint, n: bigint){
    var rInvmodn = big.modInv(r,n);

    var bm = (bs*rInvmodn) % n;

    return bm;

  }

}
