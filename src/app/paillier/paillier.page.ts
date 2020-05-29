import { Component, OnInit } from '@angular/core';
import { PaillierService } from '../paillier.service';
import * as paillier from 'paillier-bigint';
import { NgForm } from '@angular/forms';
import * as big from 'bigint-crypto-utils'
import * as rsa from 'rsa';
import * as bigconv from 'bigint-conversion'
import * as sha from 'object-sha'
import { Observable, Observer } from 'rxjs';
import { Router } from "@angular/router";

@Component({
  selector: 'app-paillier',
  templateUrl: './paillier.page.html',
  styleUrls: ['./paillier.page.scss'],
})
export class PaillierPage implements OnInit {

  serverPublicKey: paillier.PublicKey;
  publicKey: paillier.PublicKey;
  privateKey: paillier.PrivateKey;

  c1: string;
  c2: string;
  respuesta: string;

  constructor(private paillierService: PaillierService, private router: Router) { }

  ngOnInit() {
    this.claves()
    this.dameClaves()
  }

  dameClaves(){
    this.paillierService.dameClave().subscribe((res:any) => {
      this.serverPublicKey = new paillier.PublicKey(bigconv.hexToBigint(res.n),bigconv.hexToBigint(res.g));
    });
    
  }

  async claves() {
    const { publicKey, privateKey } = await paillier.generateRandomKeysSync(3072);
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  sendMessages(form: NgForm){
    var c1 : any = BigInt(form.value.cantidad1)
    var c2 : any = BigInt(form.value.cantidad2)

    var cUser1 = this.serverPublicKey.encrypt(c1);
    var cUser2 = this.serverPublicKey.encrypt(c2);
    console.log(form.value.cantidad1)

    this.c1 = bigconv.bigintToHex(cUser1);
    this.c2 = bigconv.bigintToHex(cUser2);

    var body = {
      c1: bigconv.bigintToHex(cUser1),
      c2: bigconv.bigintToHex(cUser2)      
    }

    this.paillierService.send(body).subscribe((res:any) =>{
      this.respuesta = bigconv.hexToBigint(res.suma).toString();
      console.log(bigconv.hexToBigint(res.suma));
    })


  }

  goToHome(){
    this.router.navigateByUrl('/home');
  }

}
