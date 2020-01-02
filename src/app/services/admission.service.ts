import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import { Constants } from '../app.constants';
import { BedAssignment } from '../models/bedAssignment';
import { Bill } from '../models/bill';
import { DoctorAssignment } from '../models/doctorAssignment';
import { Package } from '../models/package';
import { Admission } from '../models/admission';
import { AdmissionDiagnosis } from '../models/admissionDiagnosis';
import { Prescription } from '../models/prescription';
import { TokenStorage } from './token.storage';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable()
export class AdmissionService {

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

  public saveAdmission = (patientAdmission: Admission): Observable<Admission> => {

    const toAdd = JSON.stringify(patientAdmission);
    const re = /\"/gi;
    const toSend = '{"json":"' + toAdd.replace(re, '\'') + '"}';

    const actionUrl = Constants.apiServer + '/service/admission/admission/save';
    return this.http.post(actionUrl, toSend, { headers: this.headers })
      .map((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  public getAdmission = (id: number): Observable<any> => {

    const actionUrl = Constants.apiServer + '/service/admission/admission/get/' + id;
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

  public getDiagnoses = (parentId: number, entity: string): Observable<AdmissionDiagnosis[]> => {

    const actionUrl = Constants.apiServer + '/service/' + entity + '/diagnosis/' + parentId + '/all';
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

  public getPrescriptions = (parentId: number, entity: string): Observable<Prescription[]> => {

    const actionUrl = Constants.apiServer + '/service/' + entity + '/prescription/' + parentId + '/all';
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

  public transferDoctor = (doctorAssignment: DoctorAssignment): Observable<DoctorAssignment> => {

    const toAdd = JSON.stringify(doctorAssignment);
    const re = /\"/gi;
    const toSend = '{"json":"' + toAdd.replace(re, '\'') + '"}';

    const actionUrl = Constants.apiServer + '/service/admission/DOCTOR/transfer';
    return this.http.post(actionUrl, toSend, { headers: this.headers })
      .map((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  public transferBed = (bedAssignment: BedAssignment): Observable<BedAssignment> => {

    const toAdd = JSON.stringify(bedAssignment);
    const re = /\"/gi;
    const toSend = '{"json":"' + toAdd.replace(re, '\'') + '"}';

    const actionUrl = Constants.apiServer + '/service/admission/BED/transfer';
    return this.http.post(actionUrl, toSend, { headers: this.headers })
      .map((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }


  public savePrescription = (prescription: Prescription): Observable<Prescription> => {

    const toAdd = JSON.stringify(prescription);
    const re = /\"/gi;
    const toSend = '{"json":"' + toAdd.replace(re, '\'') + '"}';

    const actionUrl = Constants.apiServer + '/service/appointment/prescription/save';
    return this.http.post(actionUrl, toSend, { headers: this.headers })
      .map((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  public getPrescription = (id: number): Observable<any> => {

    const actionUrl = Constants.apiServer + '/service/admission/prescription/get/' + id;
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

  public getByMonths = (userId: string): Observable<Admission[]> => {

    const actionUrl = Constants.apiServer + '/service/admission/list/byMonth/' + userId;
    return this.http.get(actionUrl, { headers: this.headers })
      .map((response: Response) => <any[]>response.json())
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
