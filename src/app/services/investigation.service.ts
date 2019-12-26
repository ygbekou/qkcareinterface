import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Constants} from '../app.constants';
import { Investigation, InvestigationTest } from '../models/investigation';
import { Package } from '../models/package';
import { TokenStorage } from './token.storage';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import { SearchCriteria } from '../models';

@Injectable()
export class InvestigationService {

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
  
  public saveInvestigaton = (investigation : Investigation): Observable<Investigation> => {
    
      let toAdd = JSON.stringify(investigation);
      let re = /\"/gi;
      let toSend = '{"json":"' + toAdd.replace(re, "'") + '"}';
      
      let actionUrl = Constants.apiServer + '/service/laboratory/investigation/save';
      return this.http.post(actionUrl, toSend, { headers: this.headers })
        .map((response: Response) => {
            return response.json();
        })
        .catch(this.handleError);
   }
  
   public saveInvestigatonTests = (investigationTests : InvestigationTest[]): Observable<string> => {
    
      let toSend = JSON.stringify(investigationTests);
      
      let actionUrl = Constants.apiServer + '/service/laboratory/investigationTest/list/save';
      return this.http.post(actionUrl, toSend, { headers: this.headers })
        .map((response: Response) => {
            return response.json().response;
        })
        .catch(this.handleError);
   }
  
   public searchInvestigations = (searchCriteria: SearchCriteria, url: string): Observable<Investigation[]> => {

		const toSend = JSON.stringify(searchCriteria);

		const actionUrl = Constants.apiServer + (url ? url : '/service/laboratory/investigation/search');
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
