import { Component, LOCALE_ID, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { User } from '../../models/user';
import { PatientDetails } from './patientDetails';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Constants } from '../../app.constants';
import { Patient } from '../../models/patient';
import { UserGroup } from '../../models/userGroup';
import { GenericService, UserService, GlobalEventsManager } from '../../services';
import { AppointmentDetails } from './appointmentDetails';

@Component({
	selector: 'app-admin-patient',
	templateUrl: '../../pages/admin/adminPatient.html',
	providers: [GenericService]
})
export class AdminPatient implements OnInit {
	[x: string]: any;

	@ViewChild(PatientDetails) patientDetails: PatientDetails;
	@ViewChild(AppointmentDetails) appointmentDetails: AppointmentDetails;
	public user: User;
	public patient: Patient;
	public activeTab = 0;
	currentUser: User = JSON.parse(Cookie.get('user'));

	ABSENCES: string = Constants.ABSENCES;
	constructor(
		private genericService: GenericService,
		private globalEventsManager: GlobalEventsManager,
		private changeDetectorRef: ChangeDetectorRef
	) {
		this.user = new User();
		this.patient = new Patient();
	}

	ngOnInit() {
		console.log("AdminPatient Inited: appointmentId=" + this.globalEventsManager.selectedAppointmentId);
		this.globalEventsManager.currentPatientId.subscribe(patientId => this.patient.id = patientId)
		if (this.currentUser == null) {
			this.currentUser = new User();
		}
	}

	onAppointmentSelected($event) {
		let appointmentId = $event;
		this.appointmentDetails.getAppointment(appointmentId);
	}

	onTabChange(evt) {
		this.activeTab = evt.index;
		if (evt.index == 0) {
			this.activeTab = 0
		} else if (evt.index == 1) {
			this.activeTab = 1;
		}
	}
}
