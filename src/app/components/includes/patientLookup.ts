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
		console.log("Patient init");
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
		const parameters: string[] = [];

		parameters.push('e.id = |patientId|' + this.schText + '|Long');
		console.log('e.id = |patientId|' + this.schText + '|Long');
		this.genericService.getAllByCriteria('Patient', parameters)
			.subscribe((data: Patient[]) => {
				console.log(data);
				if (data.length > 0) {
					this.patient = data[0];
					console.log(data[0]);
					this.patientEmit.emit(this.patient);
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
			},
				error => console.log(error),
				() => console.log('Get Patient complete'));
	}
}
