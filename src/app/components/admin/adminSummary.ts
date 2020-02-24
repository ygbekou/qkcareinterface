import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Admission, Package, Patient, User } from '../../models';
import { GenericService, GlobalEventsManager, AdmissionService, TokenStorage } from '../../services';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { SummaryDetails } from './summaryDetails';
import { SummaryList } from './summaryList';
import { PhysicalExamDetails } from './physicalExamDetails';
import { PhysicalExamList } from './physicalExamList';
import { SystemReviewDetails } from './systemReviewDetails';
import { SystemReviewList } from './systemReviewList';

@Component({
	selector: 'app-admin-summary',
	templateUrl: '../../pages/admin/adminSummary.html',
	providers: []
})
export class AdminSummary extends BaseComponent implements OnInit, OnDestroy {

	@ViewChild(SummaryDetails, {static: false}) summaryDetails: SummaryDetails;
	@ViewChild(SummaryList, {static: false}) summaryList: SummaryList;
	@ViewChild(PhysicalExamDetails, {static: false}) physicalExamDetails: PhysicalExamDetails;
	@ViewChild(PhysicalExamList, {static: false}) physicalExamList: PhysicalExamList;
	@ViewChild(SystemReviewDetails, {static: false}) systemReviewDetails: SystemReviewDetails;
	@ViewChild(SystemReviewList, {static: false}) systemReviewList: SystemReviewList;

	admission: Admission = new Admission();
	medicineCols: any[];
	diagnosisCols: any[];
	patient: Patient = new Patient();

	messages: Message[] = [];
	activeTab = 0;


	constructor
		(
			public genericService: GenericService,
			public translate: TranslateService,
			public confirmationService: ConfirmationService,
			public tokenStorage: TokenStorage,
			private admissionService: AdmissionService,
			private globalEventsManager: GlobalEventsManager,
			private route: ActivatedRoute,
			private router: Router,
		) {

			super(genericService, translate, confirmationService, tokenStorage);
	}


	ngOnInit(): void {

		let admissionId = null;
		this.route
			.queryParams
			.subscribe(params => {

				if (params['patientId'] != null) {
					this.patient.id = params['patientId'];
					this.patient.medicalRecordNumber = params['mrn'];
					this.patient.name = params['patientName'];
					this.patient.user.birthDate = params['birthDate'];
					this.patient.user.sex = params['gender'];
				}

				this.admission.patient = new Patient();
				this.admission.patient.user = new User();
				this.admission.pckage = new Package();

				admissionId = params['admissionId'];
				if (admissionId != null) {
					this.admissionService.getAdmission(+admissionId)
						.subscribe((data: Admission) => {
							if (data.id > 0) {
								this.admission = data;
								this.patient = this.admission.patient;
								this.admission.admissionDatetime = new Date(this.admission.admissionDatetime);
								this.globalEventsManager.selectedAdmissionId = this.admission.id;
							}
						},
							error => console.log(error),
							() => console.log('Get Patient Admission complete'));
				} else {

				}
			});

	}

	ngOnDestroy() {
		this.admission = null;
	}

	lookUpPatient(event) {
		this.patient = event;
	}

	onTabChange(evt) {
		this.activeTab = evt.index;
		if (evt.index === 1) {
			
		} else if (evt.index === 2) {
			
		} 
	}

	onSummarySaved($event) {
		this.summaryList.updateTable($event);
		//alert('Here')
		this.summaryList.updateRowGroupMetaData();
	}
	onPhysicalExamSaved($event) {
		this.physicalExamList.updateTable($event);
		this.physicalExamList.updateRowGroupMetaData();
	}
	onSystemReviewSaved($event) {
		this.systemReviewList.updateTable($event);
		this.systemReviewList.updateRowGroupMetaData();
	}
	
	onSummarySelected($event) {
		const summaryId = $event;
		this.summaryDetails.getSummary(summaryId);
	}
	onPhysicalExamSelected($event) {
		const physicalExamId = $event;
		this.physicalExamDetails.getPhysicalExam(physicalExamId);
	}
	onSystemReviewSelected($event) {
		const systemReviewId = $event;
		this.systemReviewDetails.getSystemReview(systemReviewId);
	}

	
	gotoHistoryAndPhysical() {
		try {
		const navigationExtras: NavigationExtras = {
			queryParams: {
			'admissionId': this.admission.id,
			}
		};
		this.router.navigate(['/admin/summaryAndReport'], navigationExtras);
		} catch (e) {
		console.log(e);
		}
	}

}
