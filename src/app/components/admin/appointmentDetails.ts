import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Appointment } from '../../models/appointment';
import { Patient } from '../../models/patient';
import { GenericService, GlobalEventsManager } from '../../services';

@Component({
	selector: 'app-appointment-details',
	templateUrl: '../../pages/admin/appointmentDetails.html',
	providers: [GenericService]
})
export class AppointmentDetails implements OnInit, OnDestroy {

	public error: String = '';
	displayDialog: boolean;
	appointment: Appointment = new Appointment();

	DETAIL: string = Constants.DETAIL;
	ADD_IMAGE: string = Constants.ADD_IMAGE;
	ADD_LABEL: string = Constants.ADD_LABEL;
	COUNTRY: string = Constants.COUNTRY;
	ROLE: string = Constants.ROLE;
	SELECT_OPTION: string = Constants.SELECT_OPTION;

	@ViewChild('uploadFile') input: ElementRef;
	formData = new FormData();

	constructor
		(
			private genericService: GenericService,
			private globalEventsManager: GlobalEventsManager,
			private route: ActivatedRoute,
		) {

	}

	ngOnInit(): void {

		let appointmentId = null;


		this.route
			.queryParams
			.subscribe(params => {

				this.appointment = new Appointment();
				this.appointment.patient = new Patient();

				appointmentId = params['appointmentId'];

				if (appointmentId != null) {
					this.genericService.getOne(appointmentId, 'Appointment')
						.subscribe(result => {
							if (result.id > 0) {
								this.appointment = result
							}
							else {
								this.error = Constants.SAVE_UNSUCCESSFUL;
								this.displayDialog = true;
							}
						})
				} else {
					if (this.globalEventsManager.selectedAppointmentId)
						this.getAppointment(this.globalEventsManager.selectedAppointmentId);
				}
			});

	}

	getAppointment(appointmentId: number) {
		this.genericService.getOne(appointmentId, 'Appointment')
			.subscribe(result => {
				if (result.id > 0) {
					this.appointment = result
				}
				else {
					this.error = Constants.SAVE_UNSUCCESSFUL;
					this.displayDialog = true;
				}
			})
	}

	ngOnDestroy() {
		this.appointment = null;
	}

	save() {
	}

}
