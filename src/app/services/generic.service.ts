import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
// tslint:disable-next-line:import-blacklist
import {Observable} from 'rxjs/Rx';
import {Constants} from '../app.constants';
import {Country} from '../models/country';
import { Reference } from '../models/reference';
import { TokenStorage } from './token.storage';
import {SelectItem} from 'primeng/api';
import { ContactUsMessage } from '../models/website';

@Injectable()
export class GenericService {

  private actionUrl: string;
  private headers: Headers;
  public bloodGroups: SelectItem[];

  constructor(private http: Http, private token: TokenStorage) {
    this.headers = new Headers();
    if (this.token.hasToken()) {
      this.headers.append('Authorization', 'Bearer ' + this.token.getToken());
    }
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');

    this.bloodGroups = [
            {label: 'A+', value: 'A+'},
            {label: 'A-', value: 'A-'},
            {label: 'B+', value: 'B+'},
            {label: 'B-', value: 'B-'},
            {label: 'O+', value: 'O+'},
            {label: 'O-', value: 'O-'},
            {label: 'AB+', value: 'AB+'},
            {label: 'AB-', value: 'AB-'}
        ];
  }

  public getAllCountries = (): Observable<Country[]> => {
    const actionUrl = Constants.apiServer + '/service/base/getAllCountries';
    return this.http.get(actionUrl, {headers: this.headers})
      .map((response: Response) => <Country[]>response.json())
      .catch(this.handleError);
  }

  public getAll = (entityClass: string): Observable<any[]> => {
    const actionUrl = Constants.apiServer + '/service/' + entityClass + '/all';
    return this.http.get(actionUrl, {headers: this.headers})
      .map((response: Response) => <any[]>response.json())
      .catch(this.handleError);
  }

  public getAllByCriteria = (entityClass: string, parameters: string []): Observable<any[]> => {
    const toAdd = JSON.stringify(parameters);

    const actionUrl = Constants.apiServer + '/service/' + entityClass + '/allByCriteria';
    return this.http.post(actionUrl, toAdd, {headers: this.headers})
      .map((response: Response) => <any[]>response.json())
      .catch(this.handleError);
  }

  public save = (entity: any, entityClass: string): Observable<any> => {

      const toAdd = JSON.stringify(entity);
      const re = /\"/gi;
      const toSend = '{"json":"' + toAdd.replace(re, '\'') + '"}';

      const actionUrl = Constants.apiServer + '/service/' + entityClass + '/save';
      return this.http.post(actionUrl, toSend, { headers: this.headers })
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

   public saveWithUrl = (url: string, genericObject: any): Observable<any> => {

      const toAdd = JSON.stringify(genericObject);
      const re = /\"/gi;
      const toSend = '{"json":"' + toAdd.replace(re, '\'') + '"}';

      const actionUrl = Constants.apiServer + url;
      return this.http.post(actionUrl, toSend, { headers: this.headers })
        .map((response: Response) => {
            return response.json();
        })
        .catch(this.handleError);
   }


  public saveDoctorOrder = (entity: any): Observable<any> => {

      const toAdd = JSON.stringify(entity);
      const re = /\"/gi;
      const toSend = '{"json":"' + toAdd.replace(re, '\'') + '"}';

      const actionUrl = Constants.apiServer + '/service/DoctorOrder/saveDoctorOrder';
      return this.http.post(actionUrl, toSend, { headers: this.headers })
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


   public saveWithFile = (entity: any, entityClass: string, formData: FormData, method: string): Observable<any> => {

      const head = new Headers();
      if (this.token.hasToken()) {
         head.append('Authorization', 'Bearer ' + this.token.getToken());
      }

      const toAdd = JSON.stringify(entity);
      const re = /\"/gi;
      const toSend = '{"json":"' + toAdd.replace(re, '\'') + '"}';

      formData.append('dto', new Blob([toSend],
      {
          type: 'application/json'
      }));

      const actionUrl = Constants.apiServer + '/service/' + entityClass + '/' + method;
      return this.http.post(actionUrl, formData, { headers: head })
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

   public getOne = (id: number, entityClass: string): Observable<any> => {

      const actionUrl = Constants.apiServer + '/service/' + entityClass + '/' + id;
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

   public getNewObject = (url: string, id: number): Observable<any> => {

      const actionUrl = Constants.apiServer + url + id;
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

    public delete = (id: number, entityClass: string): Observable<any> => {

        const toDelete = JSON.stringify(id);
        const re = /\"/gi;
        const toSend = '{"json":"' + toDelete.replace(re, '\'') + '"}';

        const actionUrl = Constants.apiServer + '/service/' + entityClass + '/delete';
        return this.http.post(actionUrl, toSend, { headers: this.headers })
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


  public uploadFileWithFormData = (formData: FormData): Observable<any> => {

      const head = new Headers();

      const actionUrl = Constants.apiServer + '/service/fileUploader/uploadFile';
      return this.http.post(actionUrl, formData, { headers: head })
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

  public getActiveElements = (elementType: string): Observable<Reference[]> => {

      const actionUrl = Constants.apiServer + '/service/reference/' + elementType + '/all/active';
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
  public saveContactUsMessage = (contactUsMessage: ContactUsMessage): Observable<ContactUsMessage> => {
    const toAdd = JSON.stringify(contactUsMessage);
    const actionUrl = Constants.apiServer + '/service/ContactUsMessage/save';
    return this.http.post(actionUrl, toAdd, {headers: this.headers})
      .map((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
