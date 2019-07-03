import { Constants } from '../../app.constants';
import { Patient } from '../../models';
import { User } from '../../models/user';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GenericService, AppointmentService } from '../../services';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-patient-lookup',
  templateUrl: '../../pages/admin/patientLookup.html' 
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
