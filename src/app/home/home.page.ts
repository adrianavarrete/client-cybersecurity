import { Component, OnInit, ExistingSansProvider } from '@angular/core';
import { MensajeService } from '../mensaje.service';
import { Mensaje } from './Mensaje';
import { NgForm } from '@angular/forms';
import * as big from 'bigint-crypto-utils'
import * as rsa from 'rsa';
import * as bigconv from 'bigint-conversion'
import * as sha from 'object-sha'



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
  key: any;

  mensaje: any



  constructor(private mensajeService: MensajeService) {

  }

  async ngOnInit() {
    this.claves()
    this.dameClave()
    this.key = await this.getSimetricKey()


  }


  async enviarMensaje(form: NgForm) {
    var m = this.serverPublicKey.encrypt(bigconv.textToBigint(form.value.mensajeHTML))

    this.mensaje = new Mensaje(bigconv.bigintToHex(m), bigconv.bigintToHex(this.publicKey.e), bigconv.bigintToHex(this.publicKey.n))

    this.mensajeService.enviarMensaje(this.mensaje)
      .subscribe((res: any) => {
        this.respuesta = bigconv.bigintToText(this.privateKey.decrypt(bigconv.hexToBigint(res.respuestaServidor)))

      });
  }

  async firmaCiega(form: NgForm) {
    //var r = await big.prime(3072);
    var r = BigInt(Math.floor(Math.random() * 2000000) + 1)
    var m = bigconv.textToBigint(form.value.mensajeHTML);


    var bm = this.blindMessage(m, r, this.serverPublicKey.e, this.serverPublicKey.n)

    this.mensaje = new Mensaje(bigconv.bigintToHex(bm), bigconv.bigintToHex(this.publicKey.e), bigconv.bigintToHex(this.publicKey.n))

    this.mensajeService.firmaCiega(this.mensaje)
      .subscribe((res: any) => {
        bm = this.verifyBlindSignature(bigconv.hexToBigint(res.respuestaServidor), r, this.serverPublicKey.e, this.serverPublicKey.n);
        this.respuesta = bigconv.bigintToText(this.serverPublicKey.verify(bm))

      });
  }

  async enviaraBnoRepudio(form: NgForm) {
    const c = await this.encryptSKey(this.key, form.value.mensajeHTML);

    const body = {
      type: '1',
      src: 'A',
      dst: 'B',
      msg: bigconv.bufToHex(c),
      timestamp: Date.now()
    }

    const digest = await sha.digest(body, 'SHA-256');
    console.log(digest);
    const po = bigconv.bigintToHex(this.privateKey.sign(bigconv.textToBigint(digest)));
    const e = bigconv.bigintToHex(this.publicKey.e);
    const n = bigconv.bigintToHex(this.publicKey.n);
    console.log(this.publicKey)


    this.mensajeService.enviarBNoRepudio({ body, po, e, n })
      .subscribe(async (res: any) => {
        const hashBody = await sha.digest(res.body, 'SHA-256');

        if (hashBody == bigconv.bigintToText(this.serverPublicKey.verify(bigconv.hexToBigint(res.pr)))) {
          console.log(res.body)
        }else{
          console.log("No se ha podido verificar al servidor B")
        }
      });
  }


  async claves() {
    const { publicKey, privateKey } = await rsa.generateRandomKeys(3072);
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  dameClave() {
    this.mensajeService.dameClave().subscribe((res: any) => {
      this.serverPublicKey = new rsa.PublicKey(bigconv.hexToBigint(res.e), bigconv.hexToBigint(res.n))
    })
  }

  blindMessage(m: bigint, r: bigint, e: bigint, n: bigint) {
    var ReModn = big.modPow(r, e, n);
    var bm = (m * ReModn) % n;

    return bm;

  }

  verifyBlindSignature(bs: bigint, r: bigint, e: bigint, n: bigint) {
    var rInvmodn = big.modInv(r, n);

    var bm = (bs * rInvmodn) % n;

    return bm;

  }

  async getSimetricKey() {

    let self = this

    var methodKeyGen = {
      name: 'AES-CBC',
      length: 128
    };

    var keyUsages = [
      'encrypt',
      'decrypt'
    ];

    const keyData = await crypto.subtle.generateKey(methodKeyGen, true, keyUsages);
    const exportKeyData = await crypto.subtle.exportKey("jwk", keyData)
    return exportKeyData;

  }

  async encryptSKey(key, mensaje) {
    var iv = window.crypto.getRandomValues(new Uint8Array(16));

    var methodKey = {
      name: 'AES-CBC',
      length: 128
    };

    var keyUsages = [
      'encrypt',
      'decrypt'
    ];

    var algoEncrypt = {
      name: 'AES-CBC',
      iv: iv,
      tagLength: 128
    };

    console.log(key);

    const importedKey = await crypto.subtle.importKey("jwk",key,methodKey,false,keyUsages);
    return await crypto.subtle.encrypt(algoEncrypt,importedKey, bigconv.textToBuf(mensaje));

  }



}


