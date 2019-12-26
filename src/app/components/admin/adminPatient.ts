import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/user';
import { PatientDetails } from './patientDetails';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Constants } from '../../app.constants';
import { Patient } from '../../models/patient';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { AppointmentDetails } from './appointmentDetails';
import { AppointmentList } from './appointmentList';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { VaccineDetails } from './vaccineDetails';
import { AllergyDetails } from './allergyDetails';
import { MedicalHistoryDetails } from './medicalHistoryDetails';
import { SocialHistoryDetails } from './socialHistoryDetails';

@Component({
	selector: 'app-admin-patient',
	templateUrl: '../../pages/admin/adminPatient.html',
	providers: []
})
export class AdminPatient extends BaseComponent implements OnInit {
	[x: string]: any;

	@ViewChild(PatientDetails, {static: false}) patientDetails: PatientDetails;
	@ViewChild(VaccineDetails, {static: false}) vaccineDetails: VaccineDetails;
	@ViewChild(AllergyDetails, {static: false}) allergyDetails: AllergyDetails;
	@ViewChild(MedicalHistoryDetails, {static: false}) medicalHistoryDetails: MedicalHistoryDetails;
	@ViewChild(SocialHistoryDetails, {static: false}) socialHistoryDetails: SocialHistoryDetails;
	@ViewChild(AppointmentDetails, {static: false}) appointmentDetails: AppointmentDetails;
	@ViewChild(AppointmentList, {static: false}) appointmentList: AppointmentList;
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
		private globalEventsManager: GlobalEventsManager,
		public route: ActivatedRoute
	) {
		super(genericService, translate, confirmationService, tokenStorage);
		this.user = new User();
		this.patient = new Patient();
		let patientId = null;
		this.route
			.queryParams
			.subscribe(params => {
				patientId = params['patientId'];
				this.patient.id = patientId;
			});
	}

	ngOnInit() {
		
		
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
			//this.vaccineDetails.getVaccines();	
		} else if (evt.index === 2) {
			this.activeTab = 2;
			//this.allergyDetails.getAllergies();
		} else if (evt.index === 3) { 
			this.activeTab = 3;
			//this.medicalHistoryDetails.getMedicalHistories();
		} else if (evt.index === 4) {
			this.activeTab = 4;
			//this.socialHistoryDetails.getSocialHistories();
		} else if (evt.index === 5) {
			this.activeTab = 5;
			//this.appointmentDetails.patient = this.patient;
		}
	}
}
