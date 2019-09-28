import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Appointment, Department, Employee, Patient, SearchCriteria } from '../../models';
import { Constants } from '../../app.constants';
import { HospitalLocationDropdown, DoctorDropdown, DepartmentDropdown } from '../dropdowns';
import { GenericService, AppointmentService, TokenStorage } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';

@Component({
	selector: 'app-appointment-scheduler',
	templateUrl: '../../pages/admin/appointmentScheduler.html',
	providers: [GenericService, AppointmentService, HospitalLocationDropdown,
		DepartmentDropdown, DoctorDropdown]
}) 

export class AppointmentScheduler extends BaseComponent implements OnInit, OnDestroy {
	events: any[];
	headerConfig: any;
	dateConfig: any;
	displayEdit = false;
	appointment: Appointment;
	searchCriteria: SearchCriteria = new SearchCriteria();
	messages: Message[] = [];

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
	}

	ngOnInit(): void {

		this.headerConfig = {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		};

		this.appointment = new Appointment();
		this.appointment.department = new Department();
		this.appointment.doctor = new Employee();
		this.appointment.patient = new Patient();
		this.route
			.queryParams
			.subscribe(params => {

				if (params['patientId'] != null) {
					this.appointment.patient.id = params['patientId'];
					this.appointment.patient.medicalRecordNumber = params['mrn'];
					this.appointment.patient.name = params['patientName'];
					this.appointment.patient.user.birthDate = params['birthDate'];
					this.appointment.patient.user.sex = params['gender'];
				}



			});

	}

	ngOnDestroy() {

	}


	setScheduleConfig() {

	}

	save(status: number) {
		this.messages = [];
		this.appointment.status = status;
		if (this.appointment.patient.id === undefined) {
			this.translate.get(['COMMON.ERROR', 'MESSAGE.SELECT_PATIENT']).subscribe(res => {
				this.messages.push({
					severity:
						Constants.ERROR, summary:
						res['COMMON.ERROR'], detail:
						res['MESSAGE.SELECT_PATIENT']
				});
			});
			return;
		}
		if (this.appointment.hospitalLocation.id === undefined) {
			this.translate.get(['COMMON.ERROR', 'MESSAGE.SELECT_LOCATION']).subscribe(res => {
				this.messages.push({
					severity:
						Constants.ERROR, summary:
						res['COMMON.ERROR'], detail:
						res['MESSAGE.SELECT_LOCATION']
				});
			});
			return;
		}
		if (status === 3) {//cancel
			this.cancel(this.appointment.id);
		} else {
			try {
				// tslint:disable-next-line:no-console
				const p: Patient = this.appointment.patient;
				this.genericService.save(this.appointment, 'Appointment')
					.subscribe(result => {
						if (result.id > 0) {
							this.appointment = result;
							this.appointment.patient = p;
							if (status === 1) {//confirm
								this.confirm(this.appointment.id);
							} else {
								this.messages.push({ severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL });
								this.displayEdit = false;
								this.getAppointments();
							}

						} else {
							this.messages.push({ severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL });
						}
					});
			} catch (e) {
				console.log(e);
			}
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
		this.messages = [];
		this.appointment.id = null;
		if (this.appointment.doctor.id == null || this.appointment.department.id == null) {
			this.translate.get('MESSAGE.APPOINTMENT_DISPLAY_FAILED').subscribe((res: string) => {
				this.messages.push({ severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: res });
			});
			return;
		}
		this.displayEdit = true;
		this.appointment.appointmentDate = e.date.format();
	}

	editEventClick(e) {
		this.displayEdit = true;
		const eventId = e.calEvent.id;
		if (eventId != null && eventId > 0) {
			this.genericService.getOne(eventId, 'Appointment')
				.subscribe(result => {
					console.log(result);
					if (result.id > 0) {
						this.appointment = result;
						this.displayEdit = true;
					} else {
					}
				});
		} else {
			console.log('apt id is null');
			this.appointment.id = null;
			this.appointment.problem = '';
			this.appointment.appointmentDate = e.calEvent.start._i.split('T')[0];
			this.appointment.beginTime = e.calEvent.start._i.split('T')[1];
			this.appointment.endTime = e.calEvent.end._i.split('T')[1];
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
			this.appointmentService.getScheduleAndAppointments(this.searchCriteria)
				.subscribe(result => {
					if (result.length > 0) {
						this.events = result;
					}
				});
		}
	}

	lookUpPatient(event) {
		console.log('lookup called');
		console.log(event);
		this.appointment.patient = event;
	}
}
