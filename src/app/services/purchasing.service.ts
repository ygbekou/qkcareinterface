import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Constants} from '../app.constants';
import { PatientSale } from '../models/stocks/patientSale';
import { PurchaseOrder, PurchaseOrderProduct } from '../models/stocks/purchaseOrder';
import { ReceiveOrder } from '../models/stocks/receiveOrder';
import { SaleReturn } from '../models/stocks/saleReturn';
import { TokenStorage } from './token.storage';
import {Cookie} from 'ng2-cookies/ng2-cookies';

@Injectable()
export class PurchasingService {
 
  private actionUrl: string;
  private headers: Headers; 

  constructor(private http: Http, private token: TokenStorage) {
    this.headers = new Headers();
    if (this.token.hasToken()) {
      this.headers.append('Authorization', 'Bearer ' + this.token.getToken());
    }
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  public savePurchaseOrder = (purchaseOrder : PurchaseOrder): Observable<PurchaseOrder> => {
    
      let toAdd = JSON.stringify(purchaseOrder);
      let re = /\"/gi;
      let toSend = '{"json":"' + toAdd.replace(re, "'") + '"}';
      
      let actionUrl = Constants.apiServer + '/service/purchasing/purchaseOrder/save';
      return this.http.post(actionUrl, toSend, { headers: this.headers })
        .map((response: Response) => {
            return response.json();
        })
        .catch(this.handleError);
   }
  
   public getPurchaseOrder = (id: number): Observable<any> => {
   
      let actionUrl = Constants.apiServer + '/service/purchasing/purchaseOrder/' + id;
      return this.http.get(actionUrl, { headers: this.headers })
        .map((response: Response) => {
            if (response && response.json()) {
              const error = response.json() && response.json().error;
              if (error == null) {
                
              }
            }
            return response.json();
        })
        .catch(this.handleError);
   }
  
  public saveReceiveOrder = (receiveOrder : ReceiveOrder): Observable<ReceiveOrder> => {
    
      let toAdd = JSON.stringify(receiveOrder);
      let re = /\"/gi;
      let toSend = '{"json":"' + toAdd.replace(re, "'") + '"}';
      
      let actionUrl = Constants.apiServer + '/service/purchasing/receiveOrder/save';
      return this.http.post(actionUrl, toSend, { headers: this.headers })
        .map((response: Response) => {
            return response.json();
        })
        .catch(this.handleError);
   }
  
  public getNewReceiveOrder = (id: number): Observable<any[]> => {
   
      let actionUrl = Constants.apiServer + '/service/purchasing/purchaseOrder/newReceiveOrder/' + id;
      return this.http.get(actionUrl, { headers: this.headers })
        .map((response: Response) => {
            if (response && response.json()) {
              const error = response.json() && response.json().error;
              if (error == null) {
                
              }
            }
            return response.json();
        })
        .catch(this.handleError);
   }
  
   
  // Patient Sale 
    public savePatientSale = (patientSale : PatientSale): Observable<PatientSale> => {
    
      let toAdd = JSON.stringify(patientSale);
      let re = /\"/gi;
      let toSend = '{"json":"' + toAdd.replace(re, "'") + '"}';
      
      let actionUrl = Constants.apiServer + '/service/purchasing/patientSale/save';
      return this.http.post(actionUrl, toSend, { headers: this.headers })
        .map((response: Response) => {
            return response.json();
        })
        .catch(this.handleError);
   }
  
  public getPatientSale = (id: number): Observable<any> => {
   
      let actionUrl = Constants.apiServer + '/service/purchasing/patientSale/' + id;
      return this.http.get(actionUrl, { headers: this.headers })
        .map((response: Response) => {
            if (response && response.json()) {
              const error = response.json() && response.json().error;
              if (error == null) {
                
              }
            }
            return response.json();
        })
        .catch(this.handleError);
   }
  
  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
