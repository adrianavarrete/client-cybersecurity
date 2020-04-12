import { Component, OnInit, NgModuleDecorator } from '@angular/core';
import * as paillier from 'paillier-bigint';
import { NgForm } from '@angular/forms';
import * as big from 'bigint-crypto-utils'
import * as rsa from 'rsa';
import * as bigconv from 'bigint-conversion'
import * as sha from 'object-sha'
import * as sss from 'shamirs-secret-sharing';
import { Observable, Observer } from 'rxjs';
import { Router } from "@angular/router";
import { SecretService } from '../secret.service';


@Component({
  selector: 'app-secret',
  templateUrl: './secret.page.html',
  styleUrls: ['./secret.page.scss'],
})
export class SecretPage implements OnInit {

  shares: any;
  s1: any;
  s2: any;
  s3: any;
  secret: any;

  constructor(private secretService: SecretService, private router: Router) { }

  ngOnInit() {
    this.dameSecretSplit()
  }

  dameSecretSplit(){

    this.secretService.dameSecretSplit().subscribe((res:any) => {
      this.shares = res.respuestaServidor
      this.s1 = bigconv.bufToHex(this.shares[0].data);
      this.s2 = bigconv.bufToHex(this.shares[1].data);
      this.s3 = bigconv.bufToHex(this.shares[2].data);
      console.log(this.shares);
    })
  }

  revealSecret(form: NgForm){

    var array = []

    form.value.usuarios.forEach(element => {
      array.push(element)
    });

   

    this.secretService.dameShamirKey(array).subscribe((res:any) => {
      this.secret = bigconv.bufToText(res.respuestaServidor.data);
      console.log(bigconv.bufToText(this.secret.data));
    })

    console.log(this.secret);

  }

}
