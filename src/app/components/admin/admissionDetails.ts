import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Admission, Bed, BedAssignment, Country, DoctorAssignment, Floor, Package, Patient, Reference, Room, User } from '../../models';
import {
	DoctorDropdown, PackageDropdown, InsuranceDropdown, BuildingDropdown, FloorDropdown, RoomDropdown,
	CategoryDropdown, BedDropdown
} from '../dropdowns';
import { GenericService, GlobalEventsManager, AdmissionService, TokenStorage } from '../../services';
import { AdmissionDiagnoses } from './admissionDiagnoses';
import { DoctorOrderDetails } from './doctorOrderDetails';
import { PrescriptionDetails } from './prescriptionDetails';
import { PrescriptionList } from './prescriptionList';
import { PatientSaleDetails } from '../stocks/patientSaleDetails';
import { VitalSignDetails } from './vitalSignDetails';
import { Message, ConfirmationService } from 'primeng/api';
import { VitalSignList } from './vitalSignList';
import { DoctorOrderList } from './doctorOrderList';
import { PatientMedicineList } from './patientMedicineList';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { SummaryDetails } from './summaryDetails';
import { SummaryList } from './summaryList';
import { PhysicalExamDetails } from './physicalExamDetails';
import { PhysicalExamList } from './physicalExamList';
import { SystemReviewDetails } from './systemReviewDetails';
import { SystemReviewList } from './systemReviewList';

@Component({
	selector: 'app-admission-details',
	templateUrl: '../../pages/admin/admissionDetails.html',
	providers: [DoctorDropdown, PackageDropdown,
		InsuranceDropdown, BuildingDropdown, FloorDropdown, RoomDropdown, CategoryDropdown, BedDropdown]
})
export class AdmissionDetails extends BaseComponent implements OnInit, OnDestroy {

	@ViewChild(DoctorOrderDetails, {static: false}) doctorOrderDetails: DoctorOrderDetails;
	@ViewChild(DoctorOrderList, {static: false}) doctorOrderList: DoctorOrderList;
	@ViewChild(AdmissionDiagnoses, {static: false}) admissionDiagnoses: AdmissionDiagnoses;
	@ViewChild(PrescriptionDetails, {static: false}) prescriptionDetails: PrescriptionDetails;
	@ViewChild(PatientSaleDetails, {static: false}) patientSaleDetails: PatientSaleDetails;
	@ViewChild(VitalSignDetails, {static: false}) vitalSignDetails: VitalSignDetails;
	@ViewChild(VitalSignList, {static: false}) vitalSignList: VitalSignList;
	@ViewChild(PrescriptionList, {static: false}) prescriptionList: PrescriptionList;
	@ViewChild(PatientMedicineList, {static: false}) patientMedicineList: PatientMedicineList;
	@ViewChild(SummaryDetails, {static: false}) summaryDetails: SummaryDetails;
	@ViewChild(SummaryList, {static: false}) summaryList: SummaryList;
	@ViewChild(PhysicalExamDetails, {static: false}) physicalExamDetails: PhysicalExamDetails;
	@ViewChild(PhysicalExamList, {static: false}) physicalExamList: PhysicalExamList;
	@ViewChild(SystemReviewDetails, {static: false}) systemReviewDetails: SystemReviewDetails;
	@ViewChild(SystemReviewList, {static: false}) systemReviewList: SystemReviewList;

	admission: Admission = new Admission();
	medicineCols: any[];
	diagnosisCols: any[];
	patient: Patient = new Patient();

	messages: Message[] = [];
	activeTab = 0;


	constructor
		(
			public genericService: GenericService,
			public translate: TranslateService,
			public confirmationService: ConfirmationService,
			public tokenStorage: TokenStorage,
			private admissionService: AdmissionService,
			private globalEventsManager: GlobalEventsManager,
			public doctorDropdown: DoctorDropdown,
			public packageDropdown: PackageDropdown,
			public insuranceDropdown: InsuranceDropdown,
			public buildingDropdown: BuildingDropdown,
			public floorDropdown: FloorDropdown,
			public roomDropdown: RoomDropdown,
			public categoryDropdown: CategoryDropdown,
			public bedDropdown: BedDropdown,
			private route: ActivatedRoute
		) {

			super(genericService, translate, confirmationService, tokenStorage);
		// Initialize data
		this.initilizePatientAdmissionPatient();
		this.initilizePatientAdmissionBed();
		this.initilizePatientAdmissionDoctor();

		// Initialize the selectedParentCategoryId 
		this.categoryDropdown.getAllCategories(Constants.CATEGORY_BED);
	}

	initilizePatientAdmissionPatient() {
		this.patient.user = new User();
		this.patient.maritalStatus = new Reference();
		this.patient.occupation = new Reference();
		this.patient.nationality = new Country();
	}

	initilizePatientAdmissionBed() {
		this.admission.bedAssignment = new BedAssignment();
		this.admission.bedAssignment.bed = new Bed();
		this.admission.bedAssignment.bed.room = new Room();
		this.admission.bedAssignment.bed.room.floor = new Floor();
		this.admission.bedAssignment.bed.category = new Reference();
	}

	initilizePatientAdmissionDoctor() {
		this.admission.doctorAssignment = new DoctorAssignment();

	}

	ngOnInit(): void {

		let admissionId = null;
		this.route
			.queryParams
			.subscribe(params => {

				if (params['patientId'] != null) {
					this.patient.id = params['patientId'];
					this.patient.medicalRecordNumber = params['mrn'];
					this.patient.name = params['patientName'];
					this.patient.user.birthDate = params['birthDate'];
					this.patient.user.sex = params['gender'];
				}

				this.admission.patient = new Patient();
				this.admission.patient.user = new User();
				this.admission.pckage = new Package();

				admissionId = params['admissionId'];
				if (admissionId != null) {
					this.admissionService.getAdmission(+admissionId)
						.subscribe((data: Admission) => {
							if (data.id > 0) {
								this.admission = data;
								this.patient = this.admission.patient;
								this.admission.admissionDatetime = new Date(this.admission.admissionDatetime);
								this.globalEventsManager.selectedAdmissionId = this.admission.id;
								if (this.admission.bedAssignment == null) {
									this.initilizePatientAdmissionBed();
								}
								if (this.admission.doctorAssignment == null) {
									this.initilizePatientAdmissionDoctor();
								} else {
									this.admission.doctorAssignment.startDate = new Date(this.admission.doctorAssignment.startDate);
								}
							}
						},
							error => console.log(error),
							() => console.log('Get Patient Admission complete'));
				} else {

				}
			});

	}

	ngOnDestroy() {
		this.admission = null;
	}

	save() {
		this.messages = [];
		try {
			this.admission.patient = this.patient;
			this.admissionService.saveAdmission(this.admission)
				.subscribe(result => {
					if (result.id > 0) {
						this.admission = result;
						this.messages.push({ severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL });
					} else {
						this.messages.push({ severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL });
					}
				});
		} catch (e) {
			console.log(e);
		}
	}

	lookUpPatient(event) {
		this.patient = event;
	}

	populateFloorDropdown(event) {
		this.floorDropdown.buildingId = this.admission.bedAssignment.bed.room.floor.building.id;
		this.floorDropdown.getAllFloors();
	}

	populateRoomDropdown(event) {
		this.roomDropdown.floorId = this.admission.bedAssignment.bed.room.floor.id;
		this.roomDropdown.getAllRooms();
	}

	populateBedDropdown(event) {
		this.bedDropdown.roomId = this.admission.bedAssignment.bed.room.id;
		this.bedDropdown.categoryId = this.admission.bedAssignment.bed.category.id;
		this.bedDropdown.getAllBeds();
	}

	onTabChange(evt) {
		this.activeTab = evt.index;
		if (evt.index === 1) {
			//this.vitalSignList.ngOnInit();
		} else if (evt.index === 2) {
			//this.admissionDiagnoses.getDiagnoses();
		} else if (evt.index === 5) {
			this.prescriptionDetails.admission = this.admission;
			this.prescriptionList.admission = this.admission;
			this.prescriptionList.getPrescriptions();
		} else if (evt.index === 7) {
			this.patientMedicineList.admission = this.admission;
			this.patientMedicineList.getSaleProducts();
		} 
	}

	onPrescriptionSelected($event) {
		const prescriptionId = $event;
		this.prescriptionDetails.getPrescription(prescriptionId);
	}
	onPrescriptionSaved($event) {
		this.prescriptionList.updateTable($event);
	}
	onSummarySaved($event) {
		this.summaryList.updateTable($event);
		//alert('Here')
		this.summaryList.updateRowGroupMetaData();
	}
	onPhysicalExamSaved($event) {
		this.physicalExamList.updateTable($event);
		this.physicalExamList.updateRowGroupMetaData();
	}
	onSystemReviewSaved($event) {
		this.systemReviewList.updateTable($event);
		this.systemReviewList.updateRowGroupMetaData();
	}
	onVitalSignSelected($event) {
		const vitalSignId = $event;
		this.vitalSignDetails.getVitalSign(vitalSignId);
	}

	onVitalSignSaved($event) {
		this.vitalSignList.updateTable($event);
	}

	onDoctorOrderSelected($event) {
		const doctorOrderId = $event;
		this.doctorOrderDetails.getDoctorOrder(doctorOrderId);
	}

	onDoctorOrderSaved($event) {
		this.doctorOrderList.updateTable($event);
	}

	onPatientSaleSelected($event) {
		const patientSaleId = $event;
		this.patientSaleDetails.getPatientSale(patientSaleId);
	}
	onSummarySelected($event) {
		const summaryId = $event;
		this.summaryDetails.getSummary(summaryId);
	}
	onPhysicalExamSelected($event) {
		const physicalExamId = $event;
		this.physicalExamDetails.getPhysicalExam(physicalExamId);
	}
	onSystemReviewSelected($event) {
		const systemReviewId = $event;
		this.systemReviewDetails.getSystemReview(systemReviewId);
	}

	clear() {
		this.admission = new Admission();
		this.initilizePatientAdmissionPatient();
		this.initilizePatientAdmissionBed();
		this.initilizePatientAdmissionDoctor();
	}

}
