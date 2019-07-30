import { Component, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { AppComponent } from './app.component';
import { ScrollPanel } from 'primeng/primeng';
import { Router, NavigationExtras } from '@angular/router';
import { TokenStorage, GenericService, AppointmentService, GlobalEventsManager, VisitService } from './services';
import { ContactUsMessage } from './models/website';
import { SearchCriteria, Visit } from './models';
import { ScheduleEvent } from './models/scheduleEvent';
@Component({
	selector: 'app-rightpanel',
	templateUrl: './app.rightpanel.component.html',
	providers: [GenericService, AppointmentService, VisitService]
})
export class AppRightPanelComponent implements AfterViewInit {

	@ViewChild('scrollRightPanel') rightPanelMenuScrollerViewChild: ScrollPanel;
	public activeTab = 0;
	events: ScheduleEvent[];
	visits: Visit[];
	contactUsMessages: ContactUsMessage[] = [];
	searchCriteria: SearchCriteria = new SearchCriteria();
	constructor(public app: AppComponent,
		private genericService: GenericService,
		private visitService: VisitService,
		private appointmentService: AppointmentService,
		public globalEventsManager: GlobalEventsManager,
		public tokenStorage: TokenStorage,
		private router: Router) { }

	ngAfterViewInit() {
		setTimeout(() => { this.rightPanelMenuScrollerViewChild.moveBar(); }, 100);
	}

	getTopN(n: number) {
		console.log("getting top " + n + " Events");
		this.events = [];
		this.searchCriteria.topN = n;
		this.appointmentService.getTodayAppointments(this.searchCriteria)
			.subscribe(result => {
				if (result.length > 0) {
					this.events = result;
				}
			});
	}
	onTabChange(evt) {
		setTimeout(() => {
			this.rightPanelMenuScrollerViewChild.moveBar();
			this.activeTab = evt.index;
			if (evt.index === 0) {
				this.activeTab = 0;
			} else if (evt.index === 1) {
				this.activeTab = 1;
				this.getWaitList(4);
			} else {
				this.activeTab = 2;
				this.getTopN(4);
			}
		}, 450);
	}

	logOut() {
		this.tokenStorage.signOut();
		this.router.navigate(['/']);
		window.location.reload();
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

	removeFromTable(id: number) {
		let found = false;
		for (const aSec of this.events) {
			if (aSec.id === id) {
				this.events.splice(this.events.indexOf(aSec), 1);
				found = true;
				break;
			}
		}
		var onTheFly: ScheduleEvent[] = [];
		onTheFly.push(...this.events);
		this.events = onTheFly;
	}

	setPatientId(patientId: number, appointmentId: number) {
		this.globalEventsManager.changePatientId(patientId);
		this.globalEventsManager.changeAppointmentId(appointmentId);
	}

	getWaitList(topN: number) {
		console.log("getting top " + topN + " Visits");
		this.visits = [];
		this.visitService.getWaitList(topN)
			.subscribe(result => {
				if (result.length > 0) {
					this.visits = result;
					console.log(this.visits);
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
}
