import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { AppComponent } from './app.component';
import { ScrollPanel } from 'primeng/primeng';
import { Router } from '@angular/router';
import { TokenStorage, GenericService, AppointmentService } from './services';
import { ContactUsMessage } from './models/website';
import { SearchCriteria } from './models';
import { ScheduleEvent } from './models/scheduleEvent';
@Component({
	selector: 'app-rightpanel',
	templateUrl: './app.rightpanel.component.html',
	providers: [GenericService, AppointmentService]
})
export class AppRightPanelComponent implements AfterViewInit {

	@ViewChild('scrollRightPanel') rightPanelMenuScrollerViewChild: ScrollPanel;
	public activeTab = 0;
	events: ScheduleEvent[];
	contactUsMessages: ContactUsMessage[] = [];
	searchCriteria: SearchCriteria = new SearchCriteria();

	constructor(public app: AppComponent,
		private genericService: GenericService,
		private appointmentService: AppointmentService,
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
			} else {
				this.activeTab = 2;
				this.getTopN(5);
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
}
