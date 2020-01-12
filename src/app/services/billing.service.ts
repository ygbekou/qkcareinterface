import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Constants } from '../app.constants';
import { Bill } from '../models/bill';
import { Package } from '../models/package';
import { TokenStorage } from './token.storage';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { PatientService } from '../models';

@Injectable()
export class BillingService {

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

  public savePackage = (pckage: Package): Observable<Package> => {

    const toAdd = JSON.stringify(pckage);
    const re = /\"/gi;
    const toSend = '{"json":"' + toAdd.replace(re, '\'') + '"}';

    const actionUrl = Constants.apiServer + '/service/billing/package/save';
    return this.http.post(actionUrl, toSend, { headers: this.headers })
      .map((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  public saveBillingServiceItem = (object: any, entity: string): Observable<any> => {

    const toAdd = JSON.stringify(object);
    const actionUrl = Constants.apiServer + '/service/billing/' + entity + '/save';
    return this.http.post(actionUrl, toAdd, { headers: this.headers })
      .map((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  public deleteBillingServiceItem = (object: any, entity: string): Observable<any> => {

    const toAdd = JSON.stringify(object);
    const actionUrl = Constants.apiServer + '/service/billing/' + entity + '/delete';
    return this.http.post(actionUrl, toAdd, { headers: this.headers })
      .map((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }


  public saveBill = (bill: Bill): Observable<Bill> => {

    const toAdd = JSON.stringify(bill);
    const re = /\"/gi;
    const toSend = '{"json":"' + toAdd.replace(re, '\'') + '"}';

    const actionUrl = Constants.apiServer + '/service/billing/bill/save';
    return this.http.post(actionUrl, toSend, { headers: this.headers })
      .map((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  public getBill = (id: number): Observable<any> => {

    const actionUrl = Constants.apiServer + '/service/billing/bill/' + id;
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

  public deleteBillService = (id: number): Observable<any> => {

    const actionUrl = Constants.apiServer + '/service/billing/billService/delete/' + id;
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

  public getPackage = (id: number): Observable<any> => {

    const actionUrl = Constants.apiServer + '/service/billing/package/' + id;
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

  public getBillByItemNumber = (itemLabel: string, itemNumber: string): Observable<any> => {

    const actionUrl = Constants.apiServer + '/service/billing/bill/itemLabel/' + itemLabel + '/itemNumber/' + itemNumber;
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
  public getPatientBillAmount = (id: string): Observable<number> => {
    const actionUrl = Constants.apiServer + '/service/billing/getPatientBillAmount/' + id;
    return this.http.get(actionUrl, { headers: this.headers })
      .map((response: Response) => <number>response.json())
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
