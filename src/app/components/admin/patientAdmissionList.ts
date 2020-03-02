import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Admission, Patient, SearchCriteria } from '../../models';
import { Constants } from '../../app.constants';
import { HospitalLocationDropdown, DoctorDropdown, DepartmentDropdown } from '../dropdowns';
import { GenericService, AdmissionService, TokenStorage } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { Message, ConfirmationService, MenuItem } from 'primeng';
import { BaseComponent } from './baseComponent';

@Component({
	selector: 'app-admission-scheduler',
	templateUrl: '../../pages/admin/patientAdmissionList.html',
	providers: [GenericService, AdmissionService, HospitalLocationDropdown,
		DepartmentDropdown, DoctorDropdown]
})

export class PatientAdmissionList extends BaseComponent implements OnInit, OnDestroy {

	events: any[];
	headerConfig: any;
	dateConfig: any;
	displayEdit = false;
	options: any;
	admissions: Map<number, Admission[]>;
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
			public admissionService: AdmissionService,
			public doctorDropdown: DoctorDropdown,
			public hospitalLocationDropdown: HospitalLocationDropdown,
			public departmentDropdown: DepartmentDropdown,
			private router: Router
		) {
		super(genericService, translate, confirmationService, tokenStorage);

		this.userId = this.tokenStorage.getUserId();
	}

	ngOnInit(): void {
		this.getAdmissions();

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


	getAdmissions() {
		this.admissionService.getByYear(this.userId)
			.subscribe((data: any) => {
				 console.log(data);
				if (data) {
					this.admissions = data;
					this.pullData(data);
				}
			},
				error => console.log(error),
				() => console.log('Get all month data complete - this.admissionService.getByMonths()')
			);
	}
	gotoSchedule() {
		this.router.navigate(['/admin/patientAptScheduler']);
	}
	gotoScheduleList() {
		this.router.navigate(['/admin/patientAptSchedList']);
	}
}
