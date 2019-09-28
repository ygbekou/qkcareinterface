import { Component, OnInit, OnDestroy } from '@angular/core';
import { Visit, SearchCriteria } from '../../models';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({
	selector: 'app-visit-list',
	templateUrl: '../../pages/admin/visitList.html',
	providers: [GenericService]
})
export class VisitList extends BaseComponent implements OnInit, OnDestroy {

	visits: Visit[] = [];
	cols: any[];
	searchCriteria: SearchCriteria = new SearchCriteria();
	originalPage = '';

	constructor
		(
			public genericService: GenericService,
			public translate: TranslateService,
			public confirmationService: ConfirmationService,
			public tokenStorage: TokenStorage,
			public globalEventsManager: GlobalEventsManager,
			private route: ActivatedRoute,
			private router: Router,
	) {
		super(genericService, translate, confirmationService, tokenStorage);
	}

	ngOnInit(): void {
		this.cols = [
			{
				field: 'id', header: 'Visit ID', headerKey: 'COMMON.VISIT_ID', type: 'string',
				style: { width: '10%', 'text-align': 'center' }
			},
			{
				field: 'visitDatetime', header: 'Date', headerKey: 'COMMON.VISIT_DATETIME', type: 'date_time',
				style: { width: '15%', 'text-align': 'center' }
			},
			{
				field: 'patientId', header: 'Patient ID', headerKey: 'COMMON.PATIENT_ID', type: 'string',
				style: { width: '15%', 'text-align': 'center' }
			},
			{
				field: 'patientName', header: 'Patient Name', headerKey: 'COMMON.PATIENT_NAME', type: 'string',
				style: { width: '25%', 'text-align': 'center' }
			},
			{
				field: 'doctorName', header: 'Doctor', headerKey: 'COMMON.DOCTOR', type: 'string',
				style: { width: '25%', 'text-align': 'center' }
			} 
		];

		this.route
			.queryParams
			.subscribe(params => {

				const parameters: string[] = [];

				const endDate = new Date();
				const startDate = new Date(new Date().setDate(new Date().getDate() - 1));
				parameters.push('e.visitDatetime >= |visitDateStart|' + startDate.toLocaleDateString()
					+ ' ' + startDate.toLocaleTimeString() + '|Timestamp');
				parameters.push('e.visitDatetime < |visitDateEnd|' + endDate.toLocaleDateString()
					+ ' ' + endDate.toLocaleTimeString() + '|Timestamp');

				this.genericService.getAllByCriteria('Visit', parameters)
					.subscribe((data: Visit[]) => {
						this.visits = data;
					},
						error => console.log(error),
						() => console.log('Get all Visits complete'));
			});

		this.route
			.queryParams
			.subscribe(params => {

			this.originalPage = params['originalPage'];
		});
	 
		this.updateCols();
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.updateCols();
		});
	}

	updateCols() {
		for (const index in this.cols) {
			const col = this.cols[index];
			this.translate.get(col.headerKey).subscribe((res: string) => {
				col.header = res;
			});
		}
	}


	ngOnDestroy() {
		console.log("Visit list destroyed");
		this.visits = null;
	}

	edit(visitId: number) {
		try {
			const navigationExtras: NavigationExtras = {
				queryParams: {
					'visitId': visitId,
				}
			};
			this.router.navigate(['/admin/visitDetails'], navigationExtras);
		} catch (e) {
			console.log(e);
		}
	}

	search() {

		const parameters: string[] = [];

		parameters.push('e.status = |status|0|Integer');
		if (this.searchCriteria.medicalRecordNumber != null && this.searchCriteria.medicalRecordNumber.length > 0) {
			parameters.push('e.patient.id = |patientId|' + this.searchCriteria.id + '|Long');
		}
		if (this.searchCriteria.lastName != null && this.searchCriteria.lastName.length > 0) {
			parameters.push('e.patient.user.lastName like |lastName|' + '%' + this.searchCriteria.lastName + '%' + '|String');
		}
		if (this.searchCriteria.firstName != null && this.searchCriteria.firstName.length > 0) {
			parameters.push('e.patient.user.firstName like |firstName|' + '%' + this.searchCriteria.firstName + '%' + '|String');
		}
		if (this.searchCriteria.birthDate != null) {
			parameters.push('e.patient.user.birthDate = |birthDate|' + this.searchCriteria.birthDate.toLocaleDateString() + '|Date');
		}
		if (this.searchCriteria.visitId != null && this.searchCriteria.visitId > 0) {
			parameters.push('e.id = |visitId|' + this.searchCriteria.visitId + '|Long');
		}
		if (this.searchCriteria.visitDate != null) {
			const startDate = new Date(new Date().setDate(this.searchCriteria.visitDate.getDate()));
			const endDate = new Date(new Date().setDate(this.searchCriteria.visitDate.getDate() + 1));
			parameters.push('e.visitDatetime >= |visitDateStart|' + startDate.toLocaleDateString() + '|Timestamp');
			parameters.push('e.visitDatetime < |visitDateEnd|' + endDate.toLocaleString() + '|Timestamp');
		}

		this.genericService.getAllByCriteria('Visit', parameters, ' ORDER BY e.visitDatetime DESC ')
			.subscribe((data: Visit[]) => {
				this.visits = data;
			},
				error => console.log(error),
				() => console.log('Get Visits complete'));
	}


	redirectToOrigialPage(visit: Visit) {
		try {
		const navigationExtras: NavigationExtras = {
			queryParams: {
				'visitId': visit.id,
				'visitDatetime': visit.visitDatetime,
				'patientId': visit.patient.id,
				'patientGender`': visit.patient.user.sex,
				'patientName': visit.patient.name,
				'patientMRN': visit.patient.medicalRecordNumber,
				'patientBirthDate': visit.patient.user.birthDate
			}
		};
			this.router.navigate([this.originalPage], navigationExtras);
		} catch (e) {
			console.log(e);
		}
	}
}
