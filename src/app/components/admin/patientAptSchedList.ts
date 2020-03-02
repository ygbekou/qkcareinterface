import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Appointment, Patient, SearchCriteria } from '../../models';
import { Constants } from '../../app.constants';
import { HospitalLocationDropdown, DoctorDropdown, DepartmentDropdown } from '../dropdowns';
import { GenericService, AppointmentService, TokenStorage } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { Message, ConfirmationService, MenuItem } from 'primeng';
import { BaseComponent } from './baseComponent';

@Component({
	selector: 'app-appointment-scheduler', 
	templateUrl: '../../pages/admin/patientAptSchedList.html',
	providers: [GenericService, AppointmentService, HospitalLocationDropdown,
		DepartmentDropdown, DoctorDropdown]
}) 

export class PatientAptSchedList extends BaseComponent implements OnInit, OnDestroy {

	events: any[];
	headerConfig: any;
	dateConfig: any;
	displayEdit = false;
	options: any;
	appointments: Map<number, Appointment[]>;
	searchCriteria: SearchCriteria = new SearchCriteria();
	messages: Message[] = [];
	steps: MenuItem[];
	error = '';
	userId = '0';
	activeIndex = 0;
	constructor
		(
			public genericService: GenericService,
			public translate: TranslateService,
			public confirmationService: ConfirmationService,
			public tokenStorage: TokenStorage,
			public appointmentService: AppointmentService,
			public doctorDropdown: DoctorDropdown,
			public hospitalLocationDropdown: HospitalLocationDropdown,
			public departmentDropdown: DepartmentDropdown,
			private router: Router
		) {
		super(genericService, translate, confirmationService, tokenStorage);

		this.userId = this.tokenStorage.getUserId();
	}

	ngOnInit(): void {
		this.getAppointments();

	}
	ngOnDestroy(): void {
		//throw new Error('Method not implemented.');
	}
	setCurrentIndex(i) {
		this.activeIndex = i;
	}
	pullData(data: any) {
		let i = 0;
		this.steps = [];
		// tslint:disable-next-line: forin
		for (const index in data) { 
			this.steps[i] = {
				//label: 'Ann�e ' + index + '(' + data[index].length + ')',
				label: index,
				year: index, 
				itemIndex: i,
				command: (event: any) => {
					this.setCurrentIndex(event.item.itemIndex);
				}
			};

			i = i + 1;
		}
	}


	next() {
		if (this.activeIndex < 5) {
			this.activeIndex++;
		}
	}

	cancel(apt: Appointment) {
		this.appointmentService.cancel(apt.id)
			.subscribe(result => {
				if (result) {
					apt.status = 3;
				} else {
					this.messages.push({ severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL });
				}
			});
	}

	getAppointments() {
		this.appointmentService.getByYear(this.userId)
			.subscribe((data: any) => {
				//console.log(data);
				if (data) {
					this.appointments = data;
					this.pullData(data);
				}
			},
				error => console.log(error),
				() => console.log('Get all month data complete - this.appointmentService.getByMonths()')
			);
	}
	gotoSchedule() {
		this.router.navigate(['/admin/patientAptScheduler']);
	}
	gotoScheduleList() {
		this.router.navigate(['/admin/patientAptSchedList']);
	}
}
