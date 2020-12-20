import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getStocks() {
    return this.http.get<Object[]>('https://staging-api.brainbase.com/stocks.php');
  }

}