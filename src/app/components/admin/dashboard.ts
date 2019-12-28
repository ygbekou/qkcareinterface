import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdmissionService, AppointmentService, VisitService } from '../../services';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
// tslint:disable-next-line:import-blacklist
import { Subscription } from 'rxjs/Rx';
import { Appointment, Visit, SearchCriteria } from '../../models';
import { GlobalEventsManager } from '../../services/globalEventsManager';
import { ScheduleEvent } from 'src/app/models/scheduleEvent';

@Component({
	templateUrl: '../../pages/admin/dashboard.html'
})
export class Dashboard implements OnInit, OnDestroy {

	appointmentItem: ChartItem = new ChartItem();
	admissionItem: ChartItem = new ChartItem();
	visitItem: ChartItem = new ChartItem();
	subscription: Subscription;
	upcomingAppointments: Appointment[] = [];
	selectedAppointment: Appointment;
	upcomingAppointmentCols: any[];
	events: ScheduleEvent[];
	visits: Visit[];
	searchCriteria: SearchCriteria = new SearchCriteria();

	constructor(
		private appointmentService: AppointmentService,
		private admissionService: AdmissionService,
		private visitService: VisitService,
		private translate: TranslateService,
		private globalEventsManager: GlobalEventsManager
	) {

		this.globalEventsManager.showMenu = true;
		console.log('In dashboard');
		this.subscription = this.appointmentService.getByMonths()
			.subscribe((data: any) => {
				this.appointmentItem = this.pullData(data, 'Rendez-vous', '#00ff00', '#00ff00');
			},
				error => console.log(error),
				() => console.log('Get all month data complete - this.appointmentService.getByMonths()')
			);


		this.subscription.add(this.admissionService.getByMonths()
			.subscribe((data: any) => {
				this.admissionItem = this.pullData(data, 'Admissions', '#c4ffc1', '#c4ffc1');
			},
				error => console.log(error),
				() => console.log('Get all month data complete - this.admissionService.getByMonths() ')
			));

		console.log('Before call');
		this.subscription.add(this.visitService.getByMonths()
			.subscribe((data: any) => { 
				this.visitItem = this.pullData(data, 'Visites', '#ffc100', '#ffc100');
				console.log(this.visitItem);
			},
				error => console.log(error),
				() => console.log('Get all month data complete - this.visitService.getByMonths()')
			));
		this.getWaitList(100);
		this.getTopN(100);
	}


	pullData(data: any, itemLabel: any, backgroundColor: any, borderColor: any) {

		const chartItem: ChartItem = new ChartItem();

		const labels: any = [];
		const labelDatas: any = [];
		// tslint:disable-next-line:forin
		let i = 0;
		// tslint:disable-next-line:forin
		for (const index in data) {
			this.translate.get(['DATE.' + index]).subscribe(res => {
				labels[i] = res['DATE.' + index];
			});

			labelDatas[i] = data[index].length;
			chartItem.itemTotal += data[index].length;
			i = i + 1;

		}

		chartItem.itemData = {
			labels: labels,
			datasets: [
				{
					label: itemLabel,
					backgroundColor: backgroundColor,
					borderColor: borderColor,
					data: labelDatas
				}
			]
		};

		return chartItem;

	}


	ngOnInit(): void {
		console.log('ngOnInit: In dashboard');
		this.upcomingAppointmentCols = [
			{ field: 'appointmentDate', header: 'Date', type: 'Date' },
			{ field: 'beginTime', header: 'Begin Time' },
			{ field: 'endTime', header: 'End Time' },
			{ field: 'doctorName', header: 'Doctor' },
			{ field: 'departmentName', header: 'Department' }
		];
	}

	getWaitList(topN: number) {
		console.log('getting top ' + topN + ' Visits');
		this.visits = [];
		this.visitService.getWaitList(topN)
			.subscribe(result => {
				if (result.length > 0) {
					this.visits = result;
					console.log(this.visits);
				}
			});
	}

	getTopN(n: number) {
		console.log('getting top ' + n + ' Events');
		this.events = [];
		this.searchCriteria.topN = n;
		this.appointmentService.getTodayAppointments(this.searchCriteria)
			.subscribe(result => {
				if (result.length > 0) {
					this.events = result;
				}
			});
	}
	cancelVisit(id: number) {
		this.visitService.cancelVisit(id)
			.subscribe(result => {
				if (result) {
					this.removeVisitFromTable(id);
				}
			});
	}

	endVisit(id: number) {
		this.visitService.endVisit(id)
			.subscribe(result => {
				if (result) {
					this.removeVisitFromTable(id);
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
		const onTheFly: Visit[] = [];
		onTheFly.push(...this.visits);
		this.visits = onTheFly;
	}

	removeFromTable(id: number) {
		let found = false;
		for (const aSec of this.events) {
			if (aSec.id === id) {
				this.events.splice(this.events.indexOf(aSec), 1);
				found = true;
				break;
			}
		}
		const onTheFly: ScheduleEvent[] = [];
		onTheFly.push(...this.events);
		this.events = onTheFly;
	}

	setPatientId(patientId: number, appointmentId: number) {
		this.globalEventsManager.changePatientId(patientId);
		this.globalEventsManager.changeAppointmentId(appointmentId);
	}

	cancel(id: number) {
		this.appointmentService.cancel(id)
			.subscribe(result => {
				if (result) {
					this.removeFromTable(id);
				}
			});
	}

	confirm(id: number) {
		this.appointmentService.confirm(id)
			.subscribe(result => {
				if (result) {
					this.removeFromTable(id);
				}
			});
	}
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}


export class ChartItem {
	itemData: any;
	itemTotal = 0;
}
