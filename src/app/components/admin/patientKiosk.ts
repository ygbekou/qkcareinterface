import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { ReportView, User, UserGroup, Patient } from '../../models';
import { CountryDropdown, ReligionDropdown, OccupationDropdown, PayerTypeDropdown, InsuranceDropdown } from '../dropdowns';
import { GenericService, UserService, ReportService, GlobalEventsManager, TokenStorage } from '../../services';
import { Message, ConfirmationService, MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';
import { NgForm } from '@angular/forms';


@Component({
	selector: 'app-patient-kiosk',
	templateUrl: '../../pages/admin/patientKiosk.html',
	providers: [GenericService, UserService, ReportService, CountryDropdown, ReligionDropdown,
		OccupationDropdown, PayerTypeDropdown, InsuranceDropdown]
})
// tslint:disable-next-line: component-class-suffix
export class PatientKiosk extends BaseComponent implements OnInit, OnDestroy {

	messages: Message[] = [];
	patient: Patient = new Patient();

	DETAIL: string = Constants.DETAIL;
	COUNTRY: string = Constants.COUNTRY;
	ROLE: string = Constants.ROLE;
	SELECT_OPTION: string = Constants.SELECT_OPTION;

	@ViewChild('picture') picture: ElementRef;
	formData = new FormData();
	pictureUrl: any;

	reportView: ReportView = new ReportView();
	reportName: string;

	steps: MenuItem[];
	sexes: any[];
	selectedSex: any;
	error = '';
	activeIndex = 0;
	button = 1;
	done = false;
	failed = false;
	navigationLabel = 'Suivant';

	@ViewChild('f') myform: NgForm;

	constructor
		(
			public genericService: GenericService,
			public userService: UserService,
			public globalEventsManager: GlobalEventsManager,
			public translate: TranslateService,
			public tokenStorage: TokenStorage,
			public confirmationService: ConfirmationService,
			private route: ActivatedRoute) {


		super(genericService, translate, confirmationService, tokenStorage);
		this.patient.user = new User();
		this.sexes = [];
		this.sexes.push({ label: 'Homme', value: 'M', pic: 'male.png' });
		this.sexes.push({ label: 'Femme', value: 'F', pic: 'female.png' });
	}

	newPatient() {
		this.patient = new Patient();
		this.patient.user = new User();
		this.done = false;
		this.activeIndex = 0;
		this.myform.resetForm();
		//this.myform.form.markAsPristine();
	}

	setSex() {

		console.log(this.selectedSex);
		this.patient.user.sex = this.selectedSex.value;
		console.log(this.patient.user.sex);
	}

	ngOnInit(): void {
		let patientId = null;
		this.steps = [{
			label: 'Information personnelle',
			command: () => {
				this.activeIndex = 0;
			}
		},
		{
			label: 'Raison de visite',
			command: () => {
				this.activeIndex = 1;
			}
		},
		{
			label: 'Contacts',
			command: () => {
				this.activeIndex = 2;
			}
		},
		{
			label: 'Sommaire',
			command: () => {
				this.activeIndex = 3;
			}
		}
		];

		this.route
			.queryParams
			.subscribe(params => {
				this.patient.user = new User();
				this.patient.user.userGroup = new UserGroup();
				patientId = params['patientId'];
				if (patientId != null) {
					this.genericService.getOne(patientId, 'Patient')
						.subscribe(result => {
							if (result.id > 0) {
								this.patient = result;
								if (this.patient.user.birthDate != null) {
									this.patient.user.birthDate = new Date(this.patient.user.birthDate);
									this.patient.expiryDate = new Date(this.patient.expiryDate);
									this.patient.insuranceExpiryDate = new Date(this.patient.insuranceExpiryDate);
								}
							}
						});
				} else {

					if (params['groupId'] != null) {
						this.patient.user.userGroup.id = params['groupId'];
					}
				}
			});
	}

	ngOnDestroy() {
		this.patient = null;
	}

	save() {
		console.log('clicked-->' + this.activeIndex);
		this.failed = false;
		this.done = false;
		if (this.activeIndex === 0) {
			if (this.patient.user.sex != null) {
				this.activeIndex = 1;
			} else {
				this.activeIndex = 0;
			}

		} else if (this.activeIndex === 1) {
			if (this.patient.visitReason) {
				this.activeIndex = 2;
			} else {
				this.failed = true;
			}
		} else if (this.activeIndex === 2) {
			if (this.patient.contact && this.patient.contactPhone) {
				this.activeIndex = 3;
			} else {
				this.failed = true;
			}
		} else if (this.activeIndex === 3) {//save 

			this.messages = [];
			try {
				this.patient.user.userGroup.id = Constants.USER_GROUP_PATIENT; 
				this.userService.saveUserWithoutPicture('Patient', this.patient)
					.subscribe(result => {
						console.log(result);
						this.patient = result;
						if (result.errors === null || result.errors.length === 0) {
							this.done = true;
							setTimeout(() => {
								console.log('after 10 sec');
								this.newPatient();
							}, 10000);
						}
					});

			} catch (e) {
				console.log(e);
				this.messages.push({ severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL });
			}
		}
	}

}
