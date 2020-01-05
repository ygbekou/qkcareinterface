import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { ReportView, Parameter, User, UserGroup, Patient } from '../../models';
import { CountryDropdown, ReligionDropdown, OccupationDropdown, PayerTypeDropdown, InsuranceDropdown } from '../dropdowns';
import { GenericService, UserService, ReportService, GlobalEventsManager, TokenStorage } from '../../services';
import { Message, ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';


@Component({
	selector: 'app-patient-details',
	templateUrl: '../../pages/admin/patientDetails.html',
	providers: [GenericService, UserService, ReportService, CountryDropdown, ReligionDropdown,
		OccupationDropdown, PayerTypeDropdown, InsuranceDropdown]
})
export class PatientDetails extends BaseComponent implements OnInit, OnDestroy {

	messages: Message[] = [];
	patient: Patient = new Patient();

	DETAIL: string = Constants.DETAIL;
	COUNTRY: string = Constants.COUNTRY;
	ROLE: string = Constants.ROLE;
	SELECT_OPTION: string = Constants.SELECT_OPTION;

	@ViewChild('picture', {static: false}) picture: ElementRef;
	formData = new FormData();
	pictureUrl: any;

	reportView: ReportView = new ReportView();
	reportName: string;

	constructor
		(
			public genericService: GenericService,
			private userService: UserService,
			private reportService: ReportService,
			public globalEventsManager: GlobalEventsManager,
			public translate: TranslateService,
			public confirmationService: ConfirmationService,
			public tokenStorage: TokenStorage,
			public countryDropdown: CountryDropdown,
			public religionDropdown: ReligionDropdown,
			public occupationDropdown: OccupationDropdown,
			public payerTypeDropdown: PayerTypeDropdown,
			public insuranceDropdown: InsuranceDropdown,
			public changeDetectorRef: ChangeDetectorRef,
			public route: ActivatedRoute
		) {
		super(genericService, translate, confirmationService, tokenStorage);
		this.patient.user = new User();
	}

	ngOnInit(): void {
		let patientId = null;
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

		this.messages = [];
		this.formData = new FormData();

		const pictureEl = this.picture.nativeElement;
		if (pictureEl && pictureEl.files && (pictureEl.files.length > 0)) {
			const files: FileList = pictureEl.files;
			for (let i = 0; i < files.length; i++) {
				this.formData.append('file', files[i], files[i].name);
			}
		} else {
			// this.formData.append('file', null, null);
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

			reader.onload = (event1: ProgressEvent) => {
				this.pictureUrl = (<FileReader>event1.target).result;
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
