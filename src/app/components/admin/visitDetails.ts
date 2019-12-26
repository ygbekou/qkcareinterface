import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Patient, Visit, Reference, User } from '../../models';
import { PackageDropdown, DoctorDropdown, ServiceDropdown } from '../dropdowns';
import { GenericService, GlobalEventsManager, VisitService, TokenStorage } from '../../services';
import { AdmissionDiagnoses } from './admissionDiagnoses';
import { DoctorOrderDetails } from './doctorOrderDetails';
import { PrescriptionDetails } from './prescriptionDetails';
import { PrescriptionList } from './prescriptionList';
import { PatientSaleDetails } from '../stocks/patientSaleDetails';
import { TranslateService} from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { DoctorOrderList } from './doctorOrderList';
import { InvestigationList } from './investigationList';
import { PatientMedicineList } from './patientMedicineList';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-visit-details',
  templateUrl: '../../pages/admin/visitDetails.html',
  providers: [GenericService, VisitService]
})
export class VisitDetails extends BaseComponent implements OnInit, OnDestroy {

  displayDialog: boolean;
  visit: Visit = new Visit();
  medicineCols: any[];
  diagnosisCols: any[];
  patient: Patient = new Patient();
  shouldShow = false;
  activeTab = 0;

  vaccineGroups: Reference[] = [];

  @ViewChild(DoctorOrderDetails, {static: false}) doctorOrderDetails: DoctorOrderDetails;
  @ViewChild(DoctorOrderList, {static: false}) doctorOrderList: DoctorOrderList;
  @ViewChild(AdmissionDiagnoses, {static: false}) admissionDiagnoses: AdmissionDiagnoses;
  @ViewChild(PrescriptionDetails, {static: false}) prescriptionDetails: PrescriptionDetails;
  @ViewChild(PatientSaleDetails, {static: false}) patientSaleDetails: PatientSaleDetails;
  @ViewChild(PrescriptionList, {static: false}) prescriptionList: PrescriptionList;
  @ViewChild(InvestigationList, {static: false}) investigationList: InvestigationList;
  @ViewChild(PatientMedicineList, {static: false}) patientMedicinList: PatientMedicineList;

  messages: Message[] = [];

  constructor
    (
      public genericService: GenericService,
			public translate: TranslateService,
			public confirmationService: ConfirmationService,
			public tokenStorage: TokenStorage,
      private visitService: VisitService,
      public doctorDropdown: DoctorDropdown,
      public packageDropdown: PackageDropdown,
      public serviceDropdown: ServiceDropdown,
      private globalEventsManager: GlobalEventsManager,
      private route: ActivatedRoute,
    ) {
      super(genericService, translate, confirmationService, tokenStorage);
  }


  ngOnInit(): void {

    let visitId = null;
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


          this.visit.patient = new Patient();
          this.visit.patient.user = new User();
          //this.visit.givenVaccines.push(new GivenVaccine());

          visitId = params['visitId'];
          if (visitId != null) {
              this.visitService.getVisit(+visitId)
              .subscribe((data: Visit) => {
                if (data.id > 0) {
                  this.visit = data;
                  this.patient = this.visit.patient;
                  this.visit.visitDatetime = new Date(this.visit.visitDatetime);
                  // if (this.visit.givenVaccines.length === 0) {
                  //   this.visit.givenVaccines.push(new GivenVaccine());
                  // }
                }
              },
              error => console.log(error),
              () => console.log('Get Patient visit complete'));
          } else {

          }
     });

  }

  ngOnDestroy() {
    this.visit = null;
  }


  save() {

	this.messages = [];
    this.visit.patient = this.patient;
    try {
      this.visit.patient = this.patient;
      this.visitService.saveVisit(this.visit)
        .subscribe(result => {
          if (result.id > 0) {
            this.visit = result;
            this.visit.visitDatetime = new Date(this.visit.visitDatetime);
            this.messages.push({severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL});
          } else {
            this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL});
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  onTabChange(evt) {
    this.activeTab = evt.index;
    if (evt.index === 1) {

    } else if (evt.index === 3) {
      this.admissionDiagnoses.getDiagnoses();
    } else if (evt.index === 4) {
      this.prescriptionDetails.visit = this.visit;
      this.prescriptionList.visit = this.visit;
      this.prescriptionList.getPrescriptions();
	} else if (evt.index === 5) {
      this.investigationList.getInvestigations();
    } else if (evt.index === 6) {
      this.patientMedicinList.getSaleProducts();
    } 
  }

  onDoctorOrderSelected($event) {
    const doctorOrderId = $event;
    this.doctorOrderDetails.getDoctorOrder(doctorOrderId);
  }

   onPrescriptionSelected($event) {
    const prescriptionId = $event;
    this.prescriptionDetails.getPrescription(prescriptionId);
  }

  onPatientSaleSelected($event) {
    const patientSaleId = $event;
    this.patientSaleDetails.getPatientSale(patientSaleId);
  }

  onDoctorOrderSaved($event) {
	  //this.doctorOrderList.updateTable($event); 
	  this.doctorOrderList.getList();
  }

  lookUpPatient(event) {
    this.patient = event;
  }

  delete() {

  }

 }
