import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecretService {

  constructor(private http: HttpClient) { }

  readonly URL = 'http://localhost:8000';
  readonly URLTTP = 'http://localhost:8500';


  dameSecretSplit() {
    return this.http.get(this.URL + '/shamir');
  }

  dameShamirKey(shares) {
    return this.http.post(this.URL + '/getShamirKey', shares);
  }

}
