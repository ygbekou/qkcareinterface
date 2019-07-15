import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {User} from '../models/user';
import {Constants} from '../app.constants';
import { Department } from '../models/department';
import { Employee } from '../models/employee';
import { Patient } from '../models/patient';
import { UserGroup } from '../models/userGroup';
import { TokenStorage } from './token.storage';
import {Cookie} from 'ng2-cookies/ng2-cookies';

@Injectable()
export class UserService {

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

  public getById = (user: User): Observable<User> => {
    this.actionUrl = Constants.apiServer + '/service/user/user/' + user.id;

    return this.http.get(this.actionUrl)
      .map((response: Response) => <User>response.json())
      .catch(this.handleError);
  }

  public getAll = (): Observable<User[]> => {
    this.actionUrl = Constants.apiServer + '/service/user/getUsers';

    return this.http.get(this.actionUrl)
      .map((response: Response) => <User[]>response.json())
      .catch(this.handleError);
  }

  public search = (searchText: string): Observable<User[]> => {
    let toAdd = JSON.stringify(searchText);
    let actionUrl = Constants.apiServer + '/service/user/findPeople';
    return this.http.post(actionUrl, toAdd, {headers: this.headers})
      .map((response: Response) => {
        return <User[]>response.json();
      })
      .catch(this.handleError);
  }

  public getUsersForRole = (role: number): Observable<User[]> => {
    let toAdd = JSON.stringify(role);
    let actionUrl = Constants.apiServer + '/service/user/getUsersForRole';
    return this.http.post(actionUrl, toAdd, {headers: this.headers})
      .map((response: Response) => {
        return <User[]>response.json();
      })
      .catch(this.handleError);
  }

  public login = (user: User): Observable<Boolean> => {
    let toAdd = JSON.stringify(user);
    //let actionUrl = Constants.apiServer + '/service/user/login/login';
    let actionUrl = Constants.apiServer + '/service/token/generate-token';
    return this.http.post(actionUrl, toAdd, {headers: this.headers})
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        if (response && response.json()) {
          console.info(response.json())
          user = response.json();
          if (user.id > 0) {
            Cookie.set('user', JSON.stringify(response.json()));
            return true;
          }
        } else {
          return false;
        }
      }

      )
      .catch(
      this.handleError
      );
  }

  public saveUser = (user: User): Observable<User> => {
    let toAdd = JSON.stringify(user);
    let actionUrl = Constants.apiServer + '/service/user/saveUser';
    return this.http.post(actionUrl, toAdd, {headers: this.headers})
      .map((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  public saveUserWithoutPicture = (entityClass: string, entity : any): Observable<any> => {
    let toAdd = JSON.stringify(entity);
    let re = /\"/gi;
    let toSend = '{"json":"' + toAdd.replace(re, "'") + '"}';
    
    let actionUrl = Constants.apiServer + '/service/user/' + entityClass + '/saveWithoutPicture';
    return this.http.post(actionUrl, toSend, {headers: this.headers})
      .map((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }
  
   public saveUserWithPicture = (entityClass: string, entity : any, formData: FormData): Observable<any> => {
      
      let head = new Headers();
      if (this.token.hasToken()) {
        head.append('Authorization', 'Bearer ' + this.token.getToken());
      }
      let toAdd = JSON.stringify(entity);
      let re = /\"/gi;
      let toSend = '{"json":"' + toAdd.replace(re, "'") + '"}';
      
      formData.append('dto', new Blob([toSend],
      {
          type: "application/json"
      }));
     
      let actionUrl = Constants.apiServer + '/service/user/' + entityClass + '/save';
      return this.http.post(actionUrl, formData, { headers: head })
        .map((response: Response) => {
            if (response && response.json()) {
              const error = response.json() && response.json().error;
              if (error == null) {
                //Cookie.set('user', JSON.stringify(response.json()));
              }
            }
            return response.json();
        })
        .catch(this.handleError);
   }
  
  public sendPassword = (user: User): Observable<Boolean> => {
    let toAdd = JSON.stringify(user);
    let actionUrl = Constants.apiServer + '/service/user/forgot/sendPassword';

    return this.http.post(actionUrl, toAdd, {headers: this.headers})
      .map((response: Response) => {

        if (response && response.json().result === 'Success') {
          return true;
        } else {
          return false;
        }
      })
      .catch(this.handleError);
  }
  public changePassword = (user: User): Observable<Boolean> => {
    let toAdd = JSON.stringify(user);
    toAdd = toAdd.replace(/'/g, '&#039;');
    const actionUrl = Constants.apiServer + '/service/user/forgot/changePassword';

    return this.http.post(actionUrl, toAdd, {headers: this.headers})
      .map((response: Response) => {

        if (response && response.json().result === 'Success') {
          return true;
        } else {
          return false;
        }
      })
      .catch(this.handleError);
  }
  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
