import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PaillierService {

  constructor(private http: HttpClient) { }

  readonly URL = 'http://localhost:8000';
  readonly URLTTP = 'http://localhost:8500';


  dameClave() {
    return this.http.get(this.URL + '/paillierKey');
  }
}
