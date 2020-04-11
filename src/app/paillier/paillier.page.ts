import { Component, OnInit } from '@angular/core';
import { PaillierService } from '../paillier.service';
import * as paillier from 'paillier-bigint';
import { NgForm } from '@angular/forms';
import * as big from 'bigint-crypto-utils'
import * as rsa from 'rsa';
import * as bigconv from 'bigint-conversion'
import * as sha from 'object-sha'
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-paillier',
  templateUrl: './paillier.page.html',
  styleUrls: ['./paillier.page.scss'],
})
export class PaillierPage implements OnInit {

  serverPublicKey: paillier.PublicKey;

  constructor(private paillierService: PaillierService) { }

  ngOnInit() {
    this.dameClaves()
  }

  dameClaves(){
    this.paillierService.dameClave().subscribe((res:any) => {
      this.serverPublicKey = new paillier.PublicKey(bigconv.hexToBigint(res.n),bigconv.hexToBigint(res.g));
    });
    
  }

}
