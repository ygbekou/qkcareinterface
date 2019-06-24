import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import { Constants } from '../app.constants';
import { DoctorOrder } from '../models/doctorOrder';
import { Reference } from '../models/reference';
import { Visit } from '../models/visit';
import { TokenStorage } from './token.storage';

@Injectable()
export class VisitService {

	private actionUrl: string;
	private headers: Headers;

	public physicianApprovedList: Reference[] = [];

	constructor(private http: Http, private token: TokenStorage) {
		this.headers = new Headers();
		if (this.token.hasToken()) {
			this.headers.append('Authorization', 'Bearer ' + this.token.getToken());
		}
		this.headers.append('Content-Type', 'application/json');
		this.headers.append('Accept', 'application/json');
	}


	public saveVisit = (visit: Visit): Observable<Visit> => {

		const toAdd = JSON.stringify(visit);
		const re = /\"/gi;
		const toSend = '{"json":"' + toAdd.replace(re, '\'') + '"}';

		const actionUrl = Constants.apiServer + '/service/visit/visit/save';
		return this.http.post(actionUrl, toSend, { headers: this.headers })
			.map((response: Response) => {
				return response.json();
			})
			.catch(this.handleError);
	}

	public updateStatus = (visit: Visit): Observable<Visit> => {

		const toAdd = JSON.stringify(visit);

		const actionUrl = Constants.apiServer + '/service/visit/visit/updateStatus';
		return this.http.post(actionUrl, toAdd, { headers: this.headers })
			.map((response: Response) => {
				return response.json();
			})
			.catch(this.handleError);
	}

	public getVisit = (id: number): Observable<any> => {

		const actionUrl = Constants.apiServer + '/service/visit/visit/get/' + id;
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

	public saveDoctorOrder = (doctorOrder: DoctorOrder): Observable<DoctorOrder> => {

		const toAdd = JSON.stringify(doctorOrder);
		const re = /\"/gi;
		const toSend = '{"json":"' + toAdd.replace(re, '\'') + '"}';

		const actionUrl = Constants.apiServer + '/service/visit/doctororder/save';
		return this.http.post(actionUrl, toSend, { headers: this.headers })
			.map((response: Response) => {
				return response.json();
			})
			.catch(this.handleError);
	}

	public changeDoctorOrderStatus = (doctorOrder: DoctorOrder): Observable<DoctorOrder> => {

		const toAdd = JSON.stringify(doctorOrder);
		const re = /\"/gi;
		const toSend = '{"json":"' + toAdd.replace(re, '\'') + '"}';

		const actionUrl = Constants.apiServer + '/service/visit/doctororder/changeStatus';
		return this.http.post(actionUrl, toSend, { headers: this.headers })
			.map((response: Response) => {
				return response.json();
			})
			.catch(this.handleError);
	}

	public getByMonths = (): Observable<Visit[]> => {

		const actionUrl = Constants.apiServer + '/service/visit/list/byMonth';
		return this.http.get(actionUrl, { headers: this.headers })
			.map((response: Response) => <any[]>response.json())
			.catch(this.handleError);
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}
}
