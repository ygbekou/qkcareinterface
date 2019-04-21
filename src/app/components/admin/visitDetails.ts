import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Country, GivenVaccine, Patient, Visit, Reference, User } from '../../models';
import { EditorModule } from 'primeng/editor';
import { PackageDropdown, DoctorDropdown } from '../dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { InputTextareaModule, CheckboxModule, MultiSelectModule, CalendarModule } from 'primeng/primeng';
import { GenericService, GlobalEventsManager, VisitService } from '../../services';
import { AdmissionDiagnoses } from './admissionDiagnoses';
import { DoctorOrderDetails } from './doctorOrderDetails';
import { PrescriptionDetails } from './prescriptionDetails';
import { PrescriptionList } from './prescriptionList';
import { PatientSaleDetails } from '../stocks/patientSaleDetails';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message } from 'primeng/api';
 
@Component({
  selector: 'app-visit-details',
  templateUrl: '../../pages/admin/visitDetails.html',
  providers: [GenericService, VisitService]
})
export class VisitDetails implements OnInit, OnDestroy {
  
  displayDialog: boolean;
  visit: Visit = new Visit();
  medicineCols: any[];
  diagnosisCols: any[];
  patient: Patient = new Patient();
  
  activeTab: number = 0;
  
  vaccineGroups: Reference[] = [];
  
  @ViewChild(DoctorOrderDetails) doctorOrderDetails: DoctorOrderDetails;
  @ViewChild(AdmissionDiagnoses) admissionDiagnoses: AdmissionDiagnoses;
  @ViewChild(PrescriptionDetails) prescriptionDetails: PrescriptionDetails;
  @ViewChild(PatientSaleDetails) patientSaleDetails: PatientSaleDetails;
  @ViewChild(PrescriptionList) prescriptionList: PrescriptionList;
  
  messages: Message[] = [];
  
  constructor
    (
      private genericService: GenericService,
      private visitService: VisitService,
      private translate: TranslateService,
      private doctorDropdown: DoctorDropdown,
      private packageDropdown: PackageDropdown,
      private globalEventsManager: GlobalEventsManager,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {
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
          this.visit.givenVaccines.push(new GivenVaccine());
          
          visitId = params['visitId'];
          if (visitId != null) {
              this.visitService.getVisit(+visitId)
              .subscribe((data: Visit) => 
              { 
                if (data.id > 0) {
                  this.visit = data;
                  this.patient = this.visit.patient;
                  this.visit.visitDatetime = new Date(this.visit.visitDatetime);
                  if (this.visit.givenVaccines.length == 0) {
                    this.visit.givenVaccines.push(new GivenVaccine());
                  }
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
  
  updateAllergy(event) {
    if (-1 !== this.visit.selectedAllergies.indexOf(event.source.name)) {
      if (event.checked) {
        this.visit.selectedAllergies.push(event.source.name);
      } else {
        this.visit.selectedAllergies.splice(this.visit.selectedAllergies.indexOf(event.source.name), 1);
      }
    }
  }

  save() {
    
    this.visit.patient = this.patient;
    this.visit.status = 1;
    try {
      this.visit.patient = this.patient;
      this.visitService.saveVisit(this.visit)
        .subscribe(result => {
          if (result.id > 0) {
            this.visit = result;
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
  
  onTabChange(evt) {
    this.activeTab = evt.index;
    if (evt.index == 1) {
     
    } 
    else if (evt.index == 2) {
      this.admissionDiagnoses.getDiagnoses();
    } 
    else if (evt.index == 3) {
      this.prescriptionDetails.visit = this.visit;
      this.prescriptionList.visit = this.visit;
      this.prescriptionList.getPrescriptions();
    }
  }
  
  onDoctorOrderSelected($event) {
    let doctorOrderId = $event;
    this.doctorOrderDetails.getDoctorOrder(doctorOrderId);
  }
  
   onPrescriptionSelected($event) {
    let prescriptionId = $event;
    this.prescriptionDetails.getPrescription(prescriptionId);
  }
  
  onPatientSaleSelected($event) {
    let patientSaleId = $event;
    this.patientSaleDetails.getPatientSale(patientSaleId);
  }
  
  lookUpPatient(event) {
    this.patient = event;
  }
  
  delete() {
  
  }
  
 }
