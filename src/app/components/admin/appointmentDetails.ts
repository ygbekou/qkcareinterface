import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Appointment } from '../../models/appointment';
import { Patient } from '../../models/patient';
import { DoctorDropdown, DepartmentDropdown, HospitalLocationDropdown } from '../dropdowns';
import { GenericService, UserService, GlobalEventsManager, AppointmentService } from '../../services';
import { Message } from 'primeng/api';
@Component({
	selector: 'app-appointment-details',
	templateUrl: '../../pages/admin/appointmentDetails.html',
	providers: [GenericService, DoctorDropdown, DepartmentDropdown,
		AppointmentService, HospitalLocationDropdown]
})
export class AppointmentDetails implements OnInit, OnDestroy {
	messages: Message[] = [];
	public error: String = '';
	displayDialog: boolean;
	appointment: Appointment = new Appointment();
	DETAIL: string = Constants.DETAIL;
	ADD_IMAGE: string = Constants.ADD_IMAGE;
	ADD_LABEL: string = Constants.ADD_LABEL;
	COUNTRY: string = Constants.COUNTRY;
	ROLE: string = Constants.ROLE;
	SELECT_OPTION: string = Constants.SELECT_OPTION;
	@Output() aptSavedEvent = new EventEmitter<Appointment>();
	@ViewChild('uploadFile', {static: false}) input: ElementRef;
	formData = new FormData();
	@Input() patient: Patient;

	constructor
		(
			private genericService: GenericService,
			private userService: UserService,
			private changeDetectorRef: ChangeDetectorRef,
			public globalEventsManager: GlobalEventsManager,
			public doctorDropdown: DoctorDropdown,
			private appointmentService: AppointmentService,
			public hospitalLocationDropdown: HospitalLocationDropdown,
			public departmentDropdown: DepartmentDropdown,
			private route: ActivatedRoute,
			private router: Router
		) {

	}
 
	ngOnInit(): void {
		let appointmentId = null;
		this.route
			.queryParams
			.subscribe(params => {
				this.appointment = new Appointment();
				this.appointment.patient = this.patient;
				appointmentId = params['appointmentId'];
				if (appointmentId != null) {
					this.genericService.getOne(appointmentId, 'Appointment')
						.subscribe(result => {
							if (result.id > 0) {
								this.appointment = result;
								this.appointment.appointmentDate = new Date(this.appointment.appointmentDate);
							} else {
								this.error = Constants.SAVE_UNSUCCESSFUL;
								this.displayDialog = true;
							}
						});
				} else {
					if (this.globalEventsManager.selectedAppointmentId) {
						this.getAppointment(this.globalEventsManager.selectedAppointmentId);
					}
				}
			});

	}

	getAppointment(appointmentId: number) {
		this.genericService.getOne(appointmentId, 'Appointment')
			.subscribe(result => {
				if (result.id > 0) {
					this.appointment = result;
					this.appointment.appointmentDate = new Date(this.appointment.appointmentDate);
				} else {
					this.error = Constants.SAVE_UNSUCCESSFUL;
					this.displayDialog = true;
				}
			});
	}

	save(status: number) {
		this.messages = [];
		this.appointment.status = status;
		if (this.appointment.patient.id === undefined) {
			this.messages.push({ severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: 'Please Select a patient' });
			return;
		}
		if (this.appointment.hospitalLocation.id === undefined) {
			this.messages.push({ severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: 'Please Select a location' });
			return;
		}
		try {
			// tslint:disable-next-line:no-console
			console.info(this.appointment.appointmentDate);
			this.genericService.save(this.appointment, 'Appointment')
				.subscribe(result => {
					if (result.id > 0) {
						this.appointment = result;
						this.aptSavedEvent.emit(this.appointment);
						this.messages.push({ severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL });

					} else {
						this.messages.push({ severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL });
					}
				});
		} catch (e) {
			console.log(e);
		} 
	}
	ngOnDestroy() {
		this.appointment = null;
	}

	clear() {
		const p: Patient = this.appointment.patient;
		this.appointment = new Appointment();
		this.appointment.patient = p;
	}

	cancel() {
		this.appointmentService.cancel(this.appointment.id)
			.subscribe(result => {
				if (result) {
					this.appointment.status = 3;
					this.appointment.statusDesc = 'Annule';
					this.aptSavedEvent.emit(this.appointment);
					this.messages.push({ severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL });

				} else {
					this.messages.push({ severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL });
				}
			});
	}

	confirm() {
		this.appointmentService.confirm(this.appointment.id)
			.subscribe(result => {
				if (result) {
					this.appointment.status = 1;
					this.appointment.statusDesc = 'Confirme';
					this.aptSavedEvent.emit(this.appointment);
					this.messages.push({ severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL });

				} else {
					this.messages.push({ severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL });
				}
			});
	}

}
