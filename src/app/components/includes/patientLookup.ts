import { Patient } from '../../models';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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

  SEARCH_TEXT = 'PATIENT MRN';

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
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    'originalPage': this.originalPage,
                }
            };
            this.router.navigate(['/admin/patientList'], navigationExtras);
        } catch (e) {
            console.log(e);
        }
    }
  }

  lookUpPatient() {
    const parameters: string [] = [];
    const patient = null;

    parameters.push('e.id = |patientId|' + this.schText + '|Long');
    const patientMatricule = this.schText;

    this.genericService.getAllByCriteria('Patient', parameters)
      .subscribe((data: Patient[]) => {
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
