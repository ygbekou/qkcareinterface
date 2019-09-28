import { Component, LOCALE_ID, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { User } from '../../models/user';
import { PatientDetails } from './patientDetails';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Constants } from '../../app.constants';
import { Patient } from '../../models/patient';
import { UserGroup } from '../../models/userGroup';
import { GenericService, UserService, GlobalEventsManager, TokenStorage } from '../../services';
import { AppointmentDetails } from './appointmentDetails';
import { AppointmentList } from './appointmentList';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-admin-patient',
	templateUrl: '../../pages/admin/adminPatient.html',
	providers: [GenericService]
})
export class AdminPatient extends BaseComponent implements OnInit {
	[x: string]: any;

	@ViewChild(PatientDetails) patientDetails: PatientDetails;
	@ViewChild(AppointmentDetails) appointmentDetails: AppointmentDetails;
	@ViewChild(AppointmentList) appointmentList: AppointmentList;
	public user: User;
	public patient: Patient;
	public activeTab = 0;
	currentUser: User = JSON.parse(Cookie.get('user'));

	ABSENCES: string = Constants.ABSENCES;
	constructor(
		public genericService: GenericService,
		public confirmationService: ConfirmationService,
		public translate: TranslateService,
		public tokenStorage: TokenStorage,
		private globalEventsManager: GlobalEventsManager
	) {
		super(genericService, translate, confirmationService, tokenStorage);
		this.user = new User();
		this.patient = new Patient();
	}

	ngOnInit() {
		console.log('AdminPatient Inited: appointmentId=' + this.globalEventsManager.selectedAppointmentId);
		this.globalEventsManager.currentPatientId.subscribe(patientId => this.patient.id = patientId);
		if (this.currentUser == null) {
			this.currentUser = new User();
		}
	}

	onAppointmentSelected($event) {
		const appointmentId = $event;
		this.appointmentDetails.getAppointment(appointmentId);
	}
	onAptSaved($event) { 
		this.appointmentList.updateTable($event);
	}

	onTabChange(evt) {
		this.activeTab = evt.index;
		if (evt.index === 0) {
			this.activeTab = 0;
		} else if (evt.index === 1) {
			this.activeTab = 1;
		}
	}
}
