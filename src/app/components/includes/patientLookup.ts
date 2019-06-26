import { Constants } from '../../app.constants';
import { Patient } from '../../models';
import { User } from '../../models/user';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GenericService, AppointmentService } from '../../services';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-patient-lookup',
  template: `<div class="ui-grid ui-grid-responsive ui-fluid">
              <div class="ui-grid-row">
                <div class="ui-grid-col-5 ui-sm-12">  
                  <div class="ui-grid-row">
                     <div class="ui-grid-row">
                        <label i18n="@@patientId" for="patientId">Patient ID</label>
                        <form #searchForm="ngForm">
                          <input type="text" pInputText class="form-control" id="searchT"
                            required [(ngModel)]="schText" (change)="lookUpPatient()"
                            placeholder="{{SEARCH_TEXT}}" name="searchT"
                            #searchT="ngModel">
                        </form>
                        <button type="button" pButton icon="fa fa-search" (click)="openPatientSearchPage()"></button>    
                     </div>
                  </div>
                </div>
                <div class="ui-grid-col-6 ui-sm-12">
                  <div class="ui-grid-row">
                    <div class="ui-grid-col-4 ui-sm-12">
                      Patient ID:
                    </div>
                    <div class="ui-grid-col-4 ui-sm-12">
                      {{patient.medicalRecordNumber}}
                    </div>
                    <div class="ui-grid-col-4 ui-sm-12">
                      Gender:
                    </div>
                    <div class="ui-grid-col-4 ui-sm-12">
                      {{patient.user.sex}}
                    </div>      
                  </div>
                  <div class="ui-grid-row">
                    <div class="ui-grid-col-4 ui-sm-12">
                      Name:
                    </div>
                    <div class="ui-grid-col-4 ui-sm-12">
                      {{patient.name}}
                    </div>
                  </div>
                  <div class="ui-grid-row">
                    <div class="ui-grid-col-4 ui-sm-12">
                      DOB:
                    </div>
                    <div class="ui-grid-col-4 ui-sm-12">
                      {{patient.user.birthDate | date:'dd/MM/yyyy'}}
                    </div>
                  </div>      
                </div>
              </div>
             </div>`
})
  
  
export class PatientLookup implements OnInit {
   
  @Input() patient: Patient = new Patient();
  
  @Output() patientEmit: EventEmitter<Patient> = new EventEmitter<Patient>();
  @Input() schText: string;
  @Input() originalPage: string;
  
  SEARCH_TEXT: string = "PATIENT MRN";
  
  constructor(
        private genericService: GenericService,
        private router: Router
    ) {

  }
  
  ngOnInit() {
  
  }
  
  openPatientSearchPage() {
      if (this.schText !== undefined && this.schText !== '') {
        this.lookUpPatient();
      } else {
        try {
            let navigationExtras: NavigationExtras = {
                queryParams: {
                    "originalPage": this.originalPage,    
                }
            }
            this.router.navigate(["/admin/patientList"], navigationExtras);
        }
        catch (e) {
            console.log(e);
        }
    }
  }

  lookUpPatient() {
    let parameters: string [] = []; 
    let patient = null;
            
    parameters.push('e.medicalRecordNumber = |patientId|' + this.schText + '|String')
    let patientMatricule = this.schText;
    
    this.genericService.getAllByCriteria('Patient', parameters)
      .subscribe((data: Patient[]) => 
      { 
        if (data.length > 0) {
          this.patient = data[0];
          this.patientEmit.emit(this.patient);
        } else {
          this.patient = new Patient();
          this.patientEmit.emit(new Patient());
        }
      },
      error => console.log(error),
      () => console.log('Get Patient complete'));
  }
}
