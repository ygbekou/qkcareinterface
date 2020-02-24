import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Appointment, Department, Employee, Patient, SearchCriteria, HospitalLocation } from '../../models';
import { Constants } from '../../app.constants';
import { HospitalLocationDropdown, DoctorDropdown, DepartmentDropdown } from '../dropdowns';
import { GenericService, AppointmentService, TokenStorage } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { Message, ConfirmationService, FullCalendarModule, MenuItem } from 'primeng';
import { BaseComponent } from './baseComponent';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
	selector: 'app-appointment-scheduler',
	templateUrl: '../../pages/admin/patientAptScheduler.html',
	providers: [GenericService, AppointmentService, HospitalLocationDropdown,
		DepartmentDropdown, DoctorDropdown]
})

export class PatientAptScheduler extends BaseComponent implements OnInit, OnDestroy {
	events: any[];
	headerConfig: any;
	dateConfig: any;
	displayEdit = false;
	options: any;
	appointment: Appointment;
	searchCriteria: SearchCriteria = new SearchCriteria();
	messages: Message[] = [];
	navigationLabel = 'Suivant';
	steps: MenuItem[];
	sexes: any[];
	selectedSex: any;
	error = '';
	activeIndex = 0;
	button = 1;
	done = false;
	failed = false;
	aptDocLocSet = false;
	userId = '0';
	locations: HospitalLocation[] = [];
	departments: Department[] = [];
	doctors: Employee[] = [];
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
			private route: ActivatedRoute,
			private router: Router
		) {
		super(genericService, translate, confirmationService, tokenStorage);

		this.userId = this.tokenStorage.getUserId();
	}

	ngOnInit(): void {

		this.steps = [{
			label: 'Raison de visite',
			command: () => {
				this.activeIndex = 0;
			}
		},
		{
			label: 'Emplacement',
			command: () => {
				this.activeIndex = 1;
			}
		},
		{
			label: 'Department',
			command: () => {
				this.activeIndex = 2;
			}
		},
		{
			label: 'Medecin',
			command: () => {
				this.activeIndex = 3;
			}
		},
		{
			label: 'Date et heure',
			command: () => {
				this.activeIndex = 4;
			}
		},
		{
			label: 'Confirmation',
			command: () => {
				this.activeIndex = 5;
			}
		}
		];
		this.headerConfig = {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		};

		this.options = {
			plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
			//defaultDate: '2017-02-01',
			header: {
				left: 'prev,next',
				center: 'title',
				right: 'dayGridMonth,timeGridWeek,timeGridDay'
			},
			editable: true,
			dateClick: (e) => {
				console.log('addEventClick');
				this.addEventClick(e);
			},
			eventClick: (e) => {
				console.log('editEventClick');
				this.editEventClick(e);
			}
		};

		this.genericService.getAll('Department')
			.subscribe((data: any[]) => this.departments = data,
				error => console.log(error),
				() => console.log('Get All Departments Complete'));

		this.genericService.getAll('HospitalLocation')
			.subscribe((data: any[]) => {
				this.locations = data;
			}, error => console.log(error),
				() => console.log('Get All Locations Complete'));

		this.getAllDoctors();

		this.appointment = new Appointment();
		this.appointment.department = new Department();
		this.appointment.doctor = new Employee();
		this.appointment.patient = new Patient();
		this.getPatient();

	}

	private getAllDoctors(): void {
		const parameters: string[] = [];
		parameters.push('e.user.userGroup.id = |userGroupId|2|Long');
		this.genericService.getAllByCriteria('Employee', parameters)
			.subscribe((data: Employee[]) => {
				this.doctors = data;
			},
				error => console.log(error),
				() => console.log('Get all Doctors complete'));
	}
	ngOnDestroy() {

	}


	setScheduleConfig() {

	}

	getPatient() {
		const parameters: string[] = [];
		parameters.push('e.user.id = |userId|' + this.userId + '|Long');
		this.genericService.getAllByCriteria('Patient', parameters)
			.subscribe((data: Patient[]) => {
				this.appointment.patient = data[0];
			}, error => console.log(error),
				() => console.log('Get Patient complete'));
	}

	next() {
		if (this.activeIndex < 5) {
			this.activeIndex++;
		}
		if (this.activeIndex === 4) {
			if (this.appointment.doctor.id != null
				&& this.appointment.department.id != null
				&& this.appointment.hospitalLocation.id != null
				&& !this.appointment.beginTime) {
				this.aptDocLocSet = true;
				this.getAppointments();
			} else {
				this.aptDocLocSet = false;
			}
		}
	}
	save(status: number) {
		this.error = '';
		this.done = false;
		this.appointment.status = status;

		if (this.appointment.problem === undefined) {
			this.translate.get(['COMMON.ERROR', 'MESSAGE.VISIT_REASON']).subscribe(res => {
				this.error = res['MESSAGE.VISIT_REASON'];
			});
			return;
		}
		if (this.appointment.hospitalLocation.id === undefined) {
			this.translate.get(['COMMON.ERROR', 'MESSAGE.SELECT_LOCATION']).subscribe(res => {
				this.error = res['MESSAGE.SELECT_LOCATION'];
			});
			return;
		}
		if (this.appointment.department.id === undefined) {
			this.translate.get(['COMMON.ERROR', 'MESSAGE.SELECT_DEPARTMENT']).subscribe(res => {
				this.error = res['MESSAGE.SELECT_DEPARTMENT'];
			});
			return;
		}
		if (this.appointment.doctor.id === undefined) {
			this.translate.get(['COMMON.ERROR', 'MESSAGE.SELECT_DOCTOR']).subscribe(res => {
				this.error = res['MESSAGE.SELECT_DOCTOR'];
			});
			return;
		}

		if (this.appointment.beginTime === undefined) {
			this.translate.get(['COMMON.ERROR', 'MESSAGE.SELECT_DATE_TIME']).subscribe(res => {
				this.error = res['MESSAGE.SELECT_DATE_TIME'];
			});
			return;
		}
		try {
			this.genericService.save(this.appointment, 'Appointment')
				.subscribe(result => {
					if (result.id > 0) {
						this.done = true;
						setTimeout(() => {
							console.log('after 10 sec');
							this.router.navigate([this.tokenStorage.getHomePage()]);
						}, 5000);
					} else {
						this.error = Constants.SAVE_UNSUCCESSFUL;
					}
				});
		} catch (e) {
			console.log(e);
		}

	}

	cancel(id: number) {
		this.appointmentService.cancel(id)
			.subscribe(result => {
				if (result) {
					this.messages.push({ severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL });
					this.displayEdit = false;
					this.getAppointments();
				} else {
					this.messages.push({ severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL });
				}
			});
	}

	confirm(id: number) {
		this.appointmentService.confirm(id)
			.subscribe(result => {
				if (result) {
					this.messages.push({ severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL });
					this.displayEdit = false;
					this.getAppointments();
				} else {
					this.messages.push({ severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL });
				}
			});
	}

	addEventClick(e) {
		this.appointment.appointmentDate = e.date.format();
		this.next();
	}

	editEventClick(e) {
		const now = new Date();
		this.error = '';
		this.appointment.appointmentDate = new Date(e.event.start);
		if (this.appointment.appointmentDate > now) {
			this.appointment.beginTime = e.event.start.toString().substring(16, 21);
			this.appointment.endTime = e.event.end.toString().substring(16, 21);
			this.next();
		} else {
			this.translate.get(['COMMON.ERROR', 'MESSAGE.SELECT_FUTURE_DATE']).subscribe(res => {
				this.error = res['MESSAGE.SELECT_FUTURE_DATE'];
			});
		}
	}

	getAppointments() {
		this.events = [];
		if (this.appointment.doctor.id != null
			|| this.appointment.department.id != null
			|| this.appointment.hospitalLocation.id != null) {

			this.searchCriteria.department = this.appointment.department;
			this.searchCriteria.hospitalLocation = this.appointment.hospitalLocation;
			this.searchCriteria.doctor = this.appointment.doctor;
			this.appointmentService.getFutureAvailableSpots(this.searchCriteria)
				.subscribe(result => {
					if (result.length > 0) {
						this.events = result;
					}
				});
		}
	}

	gotoSchedule() {
		this.router.navigate(['/admin/patientAptScheduler']);
	}
	gotoScheduleList() {
		this.router.navigate(['/admin/patientAptSchedList']);
	}
	lookUpPatient(event) {
		console.log('lookup called');
		console.log(event);
		this.appointment.patient = event;
	}
}
