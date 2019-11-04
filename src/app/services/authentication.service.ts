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
    console.log(error);
    if (error.json()['path'] === '/service/token/generate-token') {
      window.sessionStorage.removeItem(TokenStorage.TOKEN_KEY);
      // window.sessionStorage.clear();
    }
    return Observable.throw(error.json() || 'Server error');
  }
}
