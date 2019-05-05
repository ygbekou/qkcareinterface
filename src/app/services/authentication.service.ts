import { User } from '../models';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';

import {Constants} from '../app.constants';
import { GlobalEventsManager } from './globalEventsManager';
import { TokenStorage } from './token.storage';
import {Http, Response, Headers} from '@angular/http';

@Injectable()
export class AuthenticationService {

  private actionUrl: string;
  private headers: Headers;
  menuMap: Map<String, number[]> = new Map();

  constructor(private http: Http,
              private tokenStorage: TokenStorage,
              private globalEventsManager: GlobalEventsManager) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');

    this.menuMap.set('/admin/dashboard', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/patientDetails', [1]);
    this.menuMap.set('/admin/patientList', [1, 2, 3]);
    this.menuMap.set('/admin/employeeDetails', [1, 2]);
    this.menuMap.set('/admin/employeeList', [1, 2]);
    this.menuMap.set('/admin/admissionDetails', [1, 2]);
    this.menuMap.set('/admin/admissionList', [1, 2, 20]);
    this.menuMap.set('/admin/bedTransfer', [1, 2]);
    this.menuMap.set('/admin/enquiryDetails', [1, 2 , 3, 4, 5, 20]);
    this.menuMap.set('/admin/enquiryList', [1, 2, 3, 4, 5, 20]);
    this.menuMap.set('/admin/scheduleDetails', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/scheduleList', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/appointmentScheduler', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/visitDetails', [2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/visitList', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/waitingList', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/investigationDetails', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/investigationList', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/billDetails', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/billList', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/serviceDetails', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/serviceList', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/packageDetails', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/packageList', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/purchaseOrderDetails', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/purchaseOrdeList', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/receiveOrderDetails', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/receiveOrderList', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/patientSaleDetails', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/patientSaleList', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/saleReturnDetails', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/saleReturnList', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/birthReportDetails', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/birthReportList', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/deathReportDetails', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/deathReportList', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/patientDetails', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/patientDetails', [1, 2, 3, 4, 5, 6]);
    this.menuMap.set('/admin/patientDetails', [1, 2, 3, 4, 5, 6]);

  }

  public getMenuMapGroups = (menuItem: string): any[] => {
    return this.menuMap.get(menuItem);
  }

  public isGroupAllowForMenu = (menuItem: string, group: string = this.tokenStorage.getRole()): boolean => {
    
    const groups = this.menuMap.get(menuItem);
    if (groups == null) {
      return false;
    }
    if (groups.indexOf(Number(group)) !== -1) {
      return true;
    }
    return false;
  }

  public attemptAuth = (user: User): Observable<any> => {
    const toAdd = JSON.stringify(user);
    const actionUrl = Constants.apiServer + '/service/token/generate-token';
    return this.http.post(actionUrl, toAdd, {headers: this.headers})
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        if (response) {
          const data = response.json();
          this.tokenStorage.saveAuthData(data);
            if (data.token !== '') {
              this.globalEventsManager.showMenu = true;
            }
          return response.json();

        } else {
          return null;
        }
      }

      )
      .catch(this.handleError);
  }


  shouldDisplay(displayList: string, authRole: string) {
    if (displayList == null) { return true; }

    const authorizedRoles = displayList.split(',');

    for (const i of authorizedRoles) {
      if (authRole === i) {
        return true;
      }
    }

    return false;
  }

  private handleError(error: Response) {
    if (error.json()['path'] === '/service/token/generate-token') {
      window.sessionStorage.removeItem(TokenStorage.TOKEN_KEY);
      // window.sessionStorage.clear();
    }
    return Observable.throw(error.json() || 'Server error');
  }
}
