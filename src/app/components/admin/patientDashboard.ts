import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdmissionService, AppointmentService, VisitService, TokenStorage, GenericService, BillingService } from '../../services';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { Appointment, Visit, SearchCriteria, Patient, Reference, Prescription } from '../../models';
import { GlobalEventsManager } from '../../services/globalEventsManager';
import { ScheduleEvent } from 'src/app/models/scheduleEvent';
import { BaseComponent } from './baseComponent';

@Component({
	templateUrl: '../../pages/admin/patientDashboard.html'
})
// tslint:disable-next-line: component-class-suffix
export class PatientDashboard extends BaseComponent implements OnInit, OnDestroy {

	appointmentItem: ChartItem = new ChartItem();
	admissionItem: ChartItem = new ChartItem();
	visitItem: ChartItem = new ChartItem();
	upcomingAppointments: Appointment[] = [];
	selectedAppointment: Appointment;
	upcomingAppointmentCols: any[];
	events: ScheduleEvent[];
	visits: Visit[];
	userId = '0';
	patient: Patient;
	amountDue = 0;
	allergyGroups: Reference[] = [];
	socialHistories: Reference[] = [];
	medicalHistories: Reference[] = [];
	nextAppointment: Appointment;
	searchCriteria: SearchCriteria = new SearchCriteria();
	prescription: Prescription;

	constructor(
		public appointmentService: AppointmentService,
		public admissionService: AdmissionService,
		public visitService: VisitService,
		public billingService: BillingService,
		public genericService: GenericService,
		public translate: TranslateService,
		public tokenStorage: TokenStorage,
		public confirmationService: ConfirmationService,
		private globalEventsManager: GlobalEventsManager
	) {
		super(genericService, translate, confirmationService, tokenStorage);
		this.userId = tokenStorage.getUserId();
		this.globalEventsManager.showMenu = true;
		this.getPatient();
		console.log('In dashboard');
		this.appointmentService.getByYear(this.userId)
			.subscribe((data: any) => {
				this.appointmentItem = this.pullData(data, 'Rendez-vous', '#00ff00', '#00ff00');
			},
				error => console.log(error),
				() => console.log('Get all month data complete - this.appointmentService.getByMonths()')
			);

		this.admissionService.getByYear(this.userId)
			.subscribe((data: any) => {
				console.log(data);
				this.admissionItem = this.pullData(data, 'Admissions', '#c4ffc1', '#c4ffc1');
			},
				error => console.log(error),
				() => console.log('Get all month data complete - this.admissionService.getByMonths() ')
			);

		this.visitService.getByYear(this.userId)
			.subscribe((data: any) => {
				this.visitItem = this.pullData(data, 'Visites', '#ffc100', '#ffc100');
				console.log(this.visitItem);
			},
				error => console.log(error),
				() => console.log('Get all month data complete - this.visitService.getByMonths()')
			);

		//get next appointment
		this.appointmentService.getNextAppointment(this.userId)
			.subscribe(result => {
				this.nextAppointment = result;
			});

		//get next appointment
		this.billingService.getPatientBillAmount(this.userId)
			.subscribe(result => {
				console.log('getPatientBillAmount=' + result);
				this.amountDue = result;
			});
			//get next appointment
		this.appointmentService.getLastPrescription(this.userId)
			.subscribe(result => {
				this.prescription = result;
			});
	}

	getPatient() {
		const parameters: string[] = [];
		parameters.push('e.user.id = |userId|' + this.userId + '|Long');
		this.genericService.getAllByCriteria('Patient', parameters)
			.subscribe((data: Patient[]) => {
				this.patient = data[0];
				if (this.patient.id > 0) {
					this.getAllergiesAndHistory();
					this.genericService.getActiveElements('allergy')
						.subscribe((data2: Reference[]) => {
							if (data2.length > 0) {
								this.allergyGroups = data2;
							}
						},
							error => console.log(error),
							() => console.log('Get ative allergies complete'));
					this.genericService.getActiveElements('socialhistory')
						.subscribe((data3: Reference[]) => {
							if (data3.length > 0) {
								this.socialHistories = data3;
							}
						},
							error => console.log(error),
							() => console.log('Get ative socialHistories complete'));

					this.genericService.getActiveElements('medicalhistory')
						.subscribe((data4: Reference[]) => {
							if (data4.length > 0) {
								this.medicalHistories = data4;
							}
						},
							error => console.log(error),
							() => console.log('Get ative medicalHistories complete'));
				}
			},
				error => console.log(error),
				() => console.log('Get all Patients complete'));
	}
	getAllergiesAndHistory() {
		this.visitService.getPatientEntities(this.patient.id, 'all')
			.subscribe((data: Patient) => {
				this.patient = data;
				console.log(this.patient);
			},
				error => console.log(error),
				() => console.log('Get all patient allergies, medical history complete'));
	}
	pullData(data: any, itemLabel: any, backgroundColor: any, borderColor: any) {

		const chartItem: ChartItem = new ChartItem();

		const labels: any = [];
		const labelDatas: any = [];
		// tslint:disable-next-line:forin
		let i = 0;
		// tslint:disable-next-line:forin
		for (const index in data) {

			labels[i] = index;
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
		//this.subscription.unsubscribe();
	}

	saveAllergy() {

		this.messages = [];
		try {
			this.visitService.saveAllergies(this.patient)
				.subscribe(result => {
					if (result.id > 0) {
						this.processResult(result, this.patient, this.messages, null);
						this.patient = result;
					} else {
						this.processResult(result, this.patient, this.messages, null);
					}
				});
		} catch (e) {
			console.log(e);
		}
	}

	saveHistory() {
		this.messages = [];
		try {
			this.visitService.saveMedicalHistories(this.patient)
				.subscribe(result => {
					if (result.id > 0) {
						//this.processResult(result, this.patient, this.messages, null);
						this.patient = result;
						try {
							this.visitService.saveSocialHistories(this.patient)
								.subscribe(result2 => {
									if (result2.id > 0) {
										this.processResult(result2, this.patient, this.messages, null);
										this.patient = result2;
									} else {
										this.processResult(result2, this.patient, this.messages, null);
									}
								});
						} catch (e) {
							console.log(e);
						}
					} else {
						this.processResult(result, this.patient, this.messages, null);
					}
				});
		} catch (e) {
			console.log(e);
		}

	}
}


export class ChartItem {
	itemData: any;
	itemTotal = 0;
}
