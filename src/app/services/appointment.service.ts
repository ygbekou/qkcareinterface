import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import { Constants } from '../app.constants';
import { SearchCriteria, Appointment } from '../models';
import { ScheduleEvent } from '../models/scheduleEvent';
import { TokenStorage } from './token.storage';

@Injectable()
export class AppointmentService {

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

	public getScheduleAndAppointments = (searchCriteria: SearchCriteria): Observable<ScheduleEvent[]> => {

		const toSend = JSON.stringify(searchCriteria);

		const actionUrl = Constants.apiServer + '/service/appointment/scheduleAndAppointments';
		return this.http.post(actionUrl, toSend, { headers: this.headers })
			.map((response: Response) => {
				return response.json();
			})
			.catch(this.handleError);
	}

	public getTodayAppointments = (searchCriteria: SearchCriteria): Observable<ScheduleEvent[]> => {

		const toSend = JSON.stringify(searchCriteria);

		const actionUrl = Constants.apiServer + '/service/appointment/getTodayAppointments';
		return this.http.post(actionUrl, toSend, { headers: this.headers })
			.map((response: Response) => {
				return response.json();
			})
			.catch(this.handleError);
	}

	public cancel = (id: number): Observable<boolean> => {
		let toAdd = JSON.stringify(id);
		let actionUrl = Constants.apiServer + '/service/appointment/cancel';
		return this.http.post(actionUrl, toAdd, { headers: this.headers })
			.map((response: Response) => {
				if (response && response.status === 200) {
					return true;
				} else {
					return false;
				}
			})
			.catch(this.handleError);
	}

	public confirm = (id: number): Observable<boolean> => {
		let toAdd = JSON.stringify(id);
		let actionUrl = Constants.apiServer + '/service/appointment/confirm';
		return this.http.post(actionUrl, toAdd, { headers: this.headers })
			.map((response: Response) => {
				console.log(response);
				if (response && response.status === 200) {
					return true;
				} else {
					return false;
				}
			})
			.catch(this.handleError);
	}

	public getByMonths = (): Observable<any[]> => {

		const actionUrl = Constants.apiServer + '/service/appointment/list/byMonth';
		return this.http.get(actionUrl, { headers: this.headers })
			.map((response: Response) => <any[]>response.json())
			.catch(this.handleError);
	}

	public getUpomings = (): Observable<any[]> => {

		const actionUrl = Constants.apiServer + '/service/appointment/list/upcomings';
		return this.http.get(actionUrl, { headers: this.headers })
			.map((response: Response) => <any[]>response.json())
			.catch(this.handleError);
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}
}
