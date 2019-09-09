import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { ReportView, Parameter, User, UserGroup, Patient } from '../../models';
import { CountryDropdown, ReligionDropdown, OccupationDropdown, PayerTypeDropdown, InsuranceDropdown } from '../dropdowns';
import { GenericService, UserService, ReportService, GlobalEventsManager } from '../../services';
import { Message, ConfirmationService, MenuItem, SelectItem } from 'primeng/api';
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
	navigationLabel = 'Suivant';

	@ViewChild('f') myform: NgForm;

	constructor
		(
			public genericService: GenericService,
			private userService: UserService,
			private reportService: ReportService,
			public globalEventsManager: GlobalEventsManager,
			public translate: TranslateService,
			public confirmationService: ConfirmationService,
			private countryDropdown: CountryDropdown,
			private religionDropdown: ReligionDropdown,
			private occupationDropdown: OccupationDropdown,
			private payerTypeDropdown: PayerTypeDropdown,
			private insuranceDropdown: InsuranceDropdown,
			private changeDetectorRef: ChangeDetectorRef,
			private route: ActivatedRoute,
			private router: Router
		) {


		super(genericService, translate, confirmationService);
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
			command: (event: any) => {
				this.activeIndex = 0;
			}
		},
		{
			label: 'Raison de visite',
			command: (event: any) => {
				this.activeIndex = 1;
			}
		},
		{
			label: 'Contacts',
			command: (event: any) => {
				this.activeIndex = 2;
			}
		},
		{
			label: 'Sommaire',
			command: (event: any) => {
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
		if (this.activeIndex === 0) {
			if (this.patient.user.sex != null) {
				this.activeIndex = 1;
			} else {
				this.activeIndex = 0;
			}

		} else if (this.activeIndex === 1) {
			this.activeIndex = 2;
		} else if (this.activeIndex === 2) {
			this.activeIndex = 3;
		} else if (this.activeIndex === 3) {//save 
			this.done = true;
			this.messages = [];
			this.formData = new FormData();
			let pictureEl ;
			if (this.picture != null) {
				pictureEl = this.picture.nativeElement;
				if (pictureEl && pictureEl.files && (pictureEl.files.length > 0)) {
					const files: FileList = pictureEl.files;
					for (let i = 0; i < files.length; i++) {
						this.formData.append('file', files[i], files[i].name);
					}
				} else {
					// this.formData.append('file', null, null);
				}

			}
			try {
				this.patient.user.userName = this.patient.user.email;
				this.patient.user.userGroup.id = Constants.USER_GROUP_PATIENT;
				if (pictureEl && pictureEl.files && (pictureEl.files.length > 0)) {
					this.userService.saveUserWithPicture('Patient', this.patient, this.formData)
						.subscribe(result => {
							this.processResult(result, this.patient, this.messages, this.pictureUrl);
						});
				} else {
					this.userService.saveUserWithoutPicture('Patient', this.patient)
						.subscribe(result => {
							this.processResult(result, this.patient, this.messages, this.pictureUrl);
						});
				}
			} catch (e) {
				console.log(e);
				this.messages.push({ severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL });
			}
		}
	}


	printIdCard() {
		this.reportView.reportName = 'patientIdCard';
		const parameter: Parameter = new Parameter();
		parameter.name = 'PATIENT_ID_PARAM';
		parameter.dataType = 'Long';
		parameter.value = this.patient.id + '';

		this.reportView.parameters = [];
		this.reportView.parameters.push(parameter);

		this.reportService.runReport(this.reportView)
			.subscribe(result => {
				if (result.reportName) {
					this.reportName = result.reportName;
					this.messages.push({ severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL });
				} else {
					this.messages.push({ severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL });
				}
			});
	}


	readUrl(event: any) {

		if (event.target.files && event.target.files[0]) {
			const reader = new FileReader();

			reader.onload = (event: ProgressEvent) => {
				this.pictureUrl = (<FileReader>event.target).result;
			};

			reader.readAsDataURL(event.target.files[0]);
		}

		this.patient.user.picture = '';
	}

	clearPictureFile() {
		this.patient.user.picture = '';
		this.pictureUrl = '';
		this.picture.nativeElement.value = '';
	}

	clear() {
		this.patient = new Patient();
	}

	delete(id: number) {
		this.genericService.delete(id, 'com.qkcare.model.Patient');
	}
} 
