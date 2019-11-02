import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import { Constants } from '../app.constants';
import { DoctorOrder } from '../models/doctorOrder';
import { Reference } from '../models/reference';
import { Visit } from '../models/visit';
import { TokenStorage } from './token.storage';
import { Patient } from '../models';

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

	public getDoctorOrder = (id: number): Observable<any> => {

		const actionUrl = Constants.apiServer + '/service/visit/doctororder/get/' + id;
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
		console.log("in GetByMonth");
		 return this.http.get(actionUrl, { headers: this.headers })
			.map((response: Response) =>{ 
				console.log("inside GetByMonth");
				console.log(response.json());
				return response.json();			
			})
			.catch(this.handleError);
	}

	public getWaitList = (topN: number): Observable<Visit[]> => {
		const actionUrl = Constants.apiServer + '/service/visit/getWaitList/' + topN;
		return this.http.get(actionUrl, { headers: this.headers })
			.map((response: Response) => <any[]>response.json())
			.catch(this.handleError);
	}

	public endVisit = (id: number): Observable<boolean> => {
		let toAdd = JSON.stringify(id);
		let actionUrl = Constants.apiServer + '/service/visit/endVisit';
		return this.http.post(actionUrl, toAdd, { headers: this.headers })
			.map((response: Response) => {
				console.log(response);
				if (response && response.json() && response.json().result === 'Success') {
					return true;
				} else {
					return false;
				}
			})
			.catch(this.handleError);
	}
	public cancelVisit = (id: number): Observable<boolean> => {
		let toAdd = JSON.stringify(id);
		let actionUrl = Constants.apiServer + '/service/visit/cancelVisit';
		return this.http.post(actionUrl, toAdd, { headers: this.headers })
			.map((response: Response) => {
				console.log(response);
				if (response && response.json() && response.json().result === 'Success') {
					return true;
				} else {
					return false;
				}
			})
			.catch(this.handleError);
	}

    public saveAllergies = (patient: Patient): Observable<Patient> => {
		const toAdd = JSON.stringify(patient);
		const actionUrl = Constants.apiServer + '/service/visit/allergies/save';
		return this.http.post(actionUrl, toAdd, {headers: this.headers})
		.map((response: Response) => {
			return response.json();
		})
		.catch(this.handleError);
   }

   public saveMedicalHistories = (patient: Patient): Observable<Patient> => {
		const toAdd = JSON.stringify(patient);
		const actionUrl = Constants.apiServer + '/service/visit/medicalHistories/save';
		return this.http.post(actionUrl, toAdd, {headers: this.headers})
		.map((response: Response) => {
			return response.json();
		})
		.catch(this.handleError);
   }

   public saveSocialHistories = (patient: Patient): Observable<Patient> => {
		const toAdd = JSON.stringify(patient);
		const actionUrl = Constants.apiServer + '/service/visit/socialHistories/save';
		return this.http.post(actionUrl, toAdd, {headers: this.headers})
		.map((response: Response) => {
			return response.json();
		})
		.catch(this.handleError);
   }

   public getPatientEntities = (patientId: number, type: string): Observable<Patient> => {
		const actionUrl = Constants.apiServer + '/service/visit/patient/' + type + '/' + patientId;
		return this.http.get(actionUrl, { headers: this.headers })
			.map((response: Response) => <any>response.json())
			.catch(this.handleError);
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}
}
