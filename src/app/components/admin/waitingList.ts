import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Visit, SearchCriteria } from '../../models';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { GenericService, VisitService, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({
	selector: 'app-waiting-list',
	templateUrl: '../../pages/admin/waitingList.html',
	providers: [GenericService]
})
export class WaitingList extends BaseComponent implements OnInit, OnDestroy {

	visits: Visit[] = [];
	cols: any[];
	autorefresh: boolean = false;
	searchCriteria: SearchCriteria = new SearchCriteria();
	interval: any;
	constructor
		(
			public genericService: GenericService,
			public visitService: VisitService,
			public translate: TranslateService,
			public confirmationService: ConfirmationService,
			public tokenStorage: TokenStorage,
			private route: ActivatedRoute,
			private router: Router,
	) {
		super(genericService, translate, confirmationService, tokenStorage);
	}

	ngOnInit(): void {
		this.cols = [
			{ field: 'id', header: 'Visit ID', headerKey: 'COMMON.VISIT_ID', width: '10%' },
			{ field: 'picture', header: 'Picture', headerKey: 'COMMON.PICTURE', type: 'image', width: '10%' },
			{ field: 'patientName', header: 'Patient', headerKey: 'COMMON.PATIENT', width: '15%' },
			{ field: 'doctorName', header: 'Date', headerKey: 'COMMON.DOCTOR', width: '15%' },
			{ field: 'visitDatetime', header: 'Arrival', headerKey: 'COMMON.ARRIVAL_TIME', type: 'date', width: '10%' },
			{ field: 'appointmentTime', header: 'Appointment', headerKey: 'COMMON.APPOINTMENT', width: '10%' }
		];

		this.getWaitList(100);

		this.updateCols();
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.updateCols();
		});

		this.interval = setInterval(() => {
			console.log("Refreshed=" + this.autorefresh);
			if (this.autorefresh) {
				console.log("Refreshing...");
				this.getWaitList(100);
			}
		}, 60000);

	}

	updateCols() {
		for (var index in this.cols) {
			let col = this.cols[index];
			this.translate.get(col.headerKey).subscribe((res: string) => {
				col.header = res;
			});
		}
	}


	ngOnDestroy() {
		this.visits = null;
	}

	updateStatus(visitId: number, status: number) {
		let visit = new Visit();
		visit.id = visitId;
		visit.status = status;
		this.visitService.updateStatus(visit)
			.subscribe(result => {
				if (result.id > 0) {
					this.removeVisitFromTable(result.id);
				}
			})
	}


	getWaitingList() {
		this.route
			.queryParams
			.subscribe(params => {

				let parameters: string[] = [];

				let endDate = new Date();
				let startDate = new Date(new Date().setDate(new Date().getDate() - 1));
				parameters.push('e.status = |status|1|Integer');

				this.genericService.getAllByCriteria('Visit', parameters)
					.subscribe((data: Visit[]) => {
						this.visits = data
					},
						error => console.log(error),
						() => console.log('Get all visit complete'));
			});
	}

	getWaitList(topN: number) {
		console.log("getting top " + topN + " Visits");
		this.visits = [];
		this.visitService.getWaitList(topN)
			.subscribe(result => {
				if (result.length > 0) {
					this.visits = result;
					//console.log(this.visits);
				}
			});
	}

	removeVisitFromTable(id: number) {
		let found = false;
		for (const aSec of this.visits) {
			if (aSec.id === id) {
				this.visits.splice(this.visits.indexOf(aSec), 1);
				found = true;
				break;
			}
		}
		var onTheFly: Visit[] = [];
		onTheFly.push(...this.visits);
		this.visits = onTheFly;
	}
}

