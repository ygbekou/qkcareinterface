import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Constants} from '../app.constants';
import { RadInvestigation } from '../models/radiology/radiologyConfig';
import { TokenStorage } from './token.storage';
import { SearchCriteria } from '../models';

@Injectable()
export class RadInvestigationService {

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
  
  public saveInvestigaton = (investigation: RadInvestigation): Observable<RadInvestigation> => {
    
      let toAdd = JSON.stringify(investigation);
      let re = /\"/gi;
      let toSend = '{"json":"' + toAdd.replace(re, "'") + '"}';
      
      let actionUrl = Constants.apiServer + '/service/radiology/investigation/save';
      return this.http.post(actionUrl, toSend, { headers: this.headers })
        .map((response: Response) => {
            return response.json();
        })
        .catch(this.handleError);
   }

   public getInvestigation = (id: number): Observable<any> => {

      const actionUrl = Constants.apiServer + '/service/radiology/investigation/get/' + id;
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
  
   public searchInvestigations = (searchCriteria: SearchCriteria): Observable<RadInvestigation[]> => {

		const toSend = JSON.stringify(searchCriteria);

		const actionUrl = Constants.apiServer + '/service/radiology/investigation/search';
		return this.http.post(actionUrl, toSend, { headers: this.headers })
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
