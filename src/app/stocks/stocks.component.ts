import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.less']
})
export class StocksComponent implements OnInit {

  public currentDay: Stock[] = [];

  public day: number = 1;

  public date: number = Date.now();

  private stocks: StockMap = [];

  private percents: Array<number> = [-10, 10];

  constructor(private _http: HttpService) {}

  nextDay() {
    this.day += 1;

    if (this.stocks[this.day] === undefined) {
      let arr: Stock[] = [];
      this.currentDay.forEach((s: Stock) => {
        let percent = this.percents[Math.floor(Math.random() * this.percents.length)];
        arr.push(new Stock(s.symbol, s.name, s.price, s.currentPrice, percent));
      });

      let StockMap: StockMap = this.stocks;

      StockMap[this.day] = arr;

      this.stocks = StockMap;
    }

    this.currentDay = this.stocks[this.day];
    this.date += 86400000;
  }

  pastDay() {
    this.day -= 1;
    this.date -= 86400000;
    this.currentDay = this.stocks[this.day];
  }

  initStocks() {
    this._http.getStocks()
    .pipe( 
      map((response: Object[]) => {
        let arr: Stock[] = [];
        response.forEach((r: Object) => {
          arr.push(new Stock(r.symbol, r.name, r.price, r.price, 0));
        });
  
        let StockMap: StockMap = {};
  
        StockMap[this.day] = arr;
  
        return StockMap;
      }))
    .subscribe((data: StockMap) => {
        this.stocks = data; 
        this.currentDay = this.stocks[this.day];
      }
    );
  }

  ngOnInit() {
    this.initStocks();
    console.log(this.date);
  }
}

export class Stock {

  public currentPrice: number = 0;
  public change: string = '0$ / 0%';

  constructor(
    public symbol: string,
    public name: string,
    public price: number,
    public lastPrice: number,
    public percOfCange: number
  ) {
    this.getCurrenctPrice();
    this.getChange();
  }

  getCurrenctPrice() {
    this.currentPrice = parseFloat(((this.lastPrice * (100 + this.percOfCange)) / 100).toFixed(2));
  }

  getChange() {
    let changePrice = this.currentPrice - this.price;
    let percent = ((changePrice * 100) / this.price).toFixed(2); 

    this.change = changePrice.toFixed(2) + '$ / ' + percent + '%';
  }
  
}

export class StockMap {
  [day: number]: Stock[];
}