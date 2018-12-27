import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../app.constants';
import { Admission, Bed, BedAssignment, Country, DoctorAssignment, Floor, Package, Patient, Reference, Room, User } from '../models';
import { EditorModule } from 'primeng/editor';
import { DoctorDropdown, PackageDropdown, InsuranceDropdown, BuildingDropdown, FloorDropdown, RoomDropdown, 
      CategoryDropdown, BedDropdown } from './dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { InputTextareaModule, CheckboxModule, MultiSelectModule, CalendarModule } from 'primeng/primeng';
import { GenericService, AppointmentService, GlobalEventsManager, AdmissionService } from '../services';
import { AdmissionDiagnoses } from './admissionDiagnoses';
import { DoctorOrderDetails } from './doctorOrderDetails';
import { PrescriptionDetails } from './prescriptionDetails';
import { PrescriptionList } from './prescriptionList';
import { PatientSaleDetails } from './stocks/patientSaleDetails';
import { VitalSignDetails } from './vitalSignDetails';
import { Message } from 'primeng/api';
 
@Component({
  selector: 'app-admission-details',
  templateUrl: '../pages/admissionDetails.html',
  providers: [DoctorDropdown, PackageDropdown, 
    InsuranceDropdown, BuildingDropdown, FloorDropdown, RoomDropdown, CategoryDropdown, BedDropdown]
})
export class AdmissionDetails implements OnInit, OnDestroy {
  
  @ViewChild(DoctorOrderDetails) doctorOrderDetails: DoctorOrderDetails;
  @ViewChild(AdmissionDiagnoses) admissionDiagnoses: AdmissionDiagnoses;
  @ViewChild(PrescriptionDetails) prescriptionDetails: PrescriptionDetails;
  @ViewChild(PatientSaleDetails) patientSaleDetails: PatientSaleDetails;
  @ViewChild(VitalSignDetails) vitalSignDetails: VitalSignDetails;
  @ViewChild(PrescriptionList) prescriptionList: PrescriptionList;
  
  admission: Admission = new Admission();
  medicineCols: any[];
  diagnosisCols: any[];
  patient: Patient = new Patient();
  
  messages: Message[] = [];
  activeTab: number = 0;
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  DEPARTMENT: string = Constants.DEPARTMENT;
  COUNTRY: string = Constants.COUNTRY;
  ROLE: string = Constants.ROLE;
  SELECT_OPTION: string = Constants.SELECT_OPTION;
  
  constructor
    (
      private genericService: GenericService,
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
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {
    
    // Initialize data
    this.initilizePatientAdmissionPatient();
    this.initilizePatientAdmissionBed();
    this.initilizePatientAdmissionDoctor();
    
    // Initialize the selectedParentCategoryId 
    this.categoryDropdown.getAllCategories(Constants.CATEGORY_MEDICINE);
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
              .subscribe((data: Admission) => 
              { 
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
                    this.admission.doctorAssignment.startDate = new Date(this.admission.doctorAssignment.startDate)
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
            this.messages.push({severity:Constants.SUCCESS, summary:Constants.SAVE_LABEL, detail:Constants.SAVE_SUCCESSFUL});
          }
          else {
            this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:Constants.SAVE_UNSUCCESSFUL});
          }
        })
    }
    catch (e) {
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
    if (evt.index == 1) {
   
    } 
    else if (evt.index == 2) {
      this.admissionDiagnoses.getDiagnoses();
    } 
    else if (evt.index == 3) {
      this.prescriptionDetails.admission = this.admission;
      this.prescriptionList.admission = this.admission;
      this.prescriptionList.getPrescriptions();
    }
  }
  
  onPrescriptionSelected($event) {
    let prescriptionId = $event;
    this.prescriptionDetails.getPrescription(prescriptionId);
  }
  
  onVitalSignSelected($event) {
    let vitalSignId = $event;
    this.vitalSignDetails.getVitalSign(vitalSignId);
  }
  
  onDoctorOrderSelected($event) {
    let doctorOrderId = $event;
    this.doctorOrderDetails.getDoctorOrder(doctorOrderId);
  }
  
  onPatientSaleSelected($event) {
    let patientSaleId = $event;
    this.patientSaleDetails.getPatientSale(patientSaleId);
  }
  
  delete() {}

 }
