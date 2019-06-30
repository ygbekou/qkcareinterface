import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Appointment } from '../../models/appointment';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule, Message } from 'primeng/primeng';
import { User } from '../../models/user';
import { GenericService, GlobalEventsManager } from '../../services';
import { Patient } from 'src/app/models';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
	selector: 'app-appointment-list',
	templateUrl: '../../pages/admin/appointmentList.html',
	providers: [GenericService]
})
export class AppointmentList implements OnInit, OnDestroy {

	public error: String = '';
	displayDialog: boolean;
	appointments: Appointment[] = [];
	cols: any[];
	messages: Message[] = [];
	DETAIL: string = Constants.DETAIL;
	ADD_IMAGE: string = Constants.ADD_IMAGE;
	ADD_LABEL: string = Constants.ADD_LABEL;

	@Output() appointmentIdEvent = new EventEmitter<string>();

	constructor
		(
			private genericService: GenericService,
			private changeDetectorRef: ChangeDetectorRef,
			private route: ActivatedRoute,
			private translate: TranslateService,
			public globalEventsManager: GlobalEventsManager,
			private router: Router,
	) {


	}

	ngOnInit(): void {
		this.cols = [
			{ field: 'appointmentDate', header: 'Date', type: 'Date' },
			{ field: 'beginTime', header: 'Begin Time', headerKey: 'COMMON.START_TIME' },
			{ field: 'endTime', header: 'End Time', headerKey: 'COMMON.END_TIME' },
			{ field: 'doctorName', header: 'Doctor', headerKey: 'COMMON.DOCTOR' },
			{ field: 'departmentName', header: 'Department', headerKey: 'COMMON.DEPARTMENT' },
			{ field: 'statusDesc', header: 'Etat', headerKey: 'COMMON.STATUS' }
		];

		let patientId = null;
		this.route
			.queryParams
			.subscribe(params => {

				patientId = params['patientId'];

				let parameters: string[] = [];

				if (patientId != null) {
					parameters.push('e.patient.id = |patientId|' + patientId + '|Long')
				}
				this.genericService.getAllByCriteria('Appointment', parameters)
					.subscribe((data: Appointment[]) => {
						this.appointments = data
					},
						error => console.log(error),
						() => console.log('Get all Appointment complete'));
			});

		this.updateCols();
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.updateCols();
		});
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
		this.appointments = null;
	}

	edit(appointmentId: string) {
		this.appointmentIdEvent.emit(appointmentId);
	}

	delete(apt: Appointment) {
		this.genericService.delete(apt.id, 'Appointment')
			.subscribe(result => {
				if (result.result === 'SUCCESS') {
					this.messages.push({ severity: Constants.SUCCESS, summary: Constants.DELETE_LABEL, detail: Constants.DELETE_SUCCESSFUL });
					this.removeFromTable(apt);
				} else {
					this.messages.push({ severity: Constants.ERROR, summary: Constants.DELETE_UNSUCCESSFUL, detail: result.result });
				}
			});
	}

	updateTable(apt: Appointment) {
		let found = false;
		for (const aSec of this.appointments) {
			if (aSec.id === apt.id) {
				this.appointments[this.appointments.indexOf(aSec)] = apt;
				found = true;
				console.log('found. id=' + aSec.id);
				break;
			}
		}
		if (!found) {
			this.appointments.push(apt);
		}
		var onTheFly: Appointment[] = [];
		onTheFly.push(...this.appointments);
		this.appointments = onTheFly;
	}

	removeFromTable(apt: Appointment) {
		for (const aSec of this.appointments) {
			if (aSec.id === apt.id) {
				this.appointments.splice(this.appointments.indexOf(aSec), 1);
				break;
			}
		}
		var onTheFly: Appointment[] = [];
		onTheFly.push(...this.appointments);
		this.appointments = onTheFly;
	}
}
