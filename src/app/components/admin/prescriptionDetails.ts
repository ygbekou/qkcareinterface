import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Admission, Appointment, Diagnosis, Product, Patient, Prescription, PrescriptionDiagnosis, 
        PrescriptionMedicine, User, Visit } from '../../models';
import { EditorModule } from 'primeng/editor';
import { DoctorDropdown, MedicineDropdown } from '../dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { InputTextareaModule, CheckboxModule, CalendarModule } from 'primeng/primeng';
import { GenericService, AdmissionService, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message } from 'primeng/api';


@Component({
  selector: 'app-prescription-details',
  templateUrl: '../../pages/admin/prescriptionDetails.html',
  providers: [GenericService, AdmissionService, MedicineDropdown]
})
export class PrescriptionDetails implements OnInit, OnDestroy {
  
  prescription: Prescription = new Prescription();
  medicineCols: any[];
  diagnosisCols: any[];
  
  messages: Message[] = [];
  
  @Input() admission: Admission;
  @Input() visit: Visit;
  
  invalidDatetime: boolean = false;
  invalidType: boolean = false;
  
  constructor
    (
      private globalEventsManager: GlobalEventsManager,
      private genericService: GenericService,
      private admissionService: AdmissionService,
      private translate: TranslateService,
      private medicineDropdown: MedicineDropdown,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {
    
  }

  ngOnInit(): void {

     this.medicineCols = [
            { field: 'medicine', header: 'Medicine', headerKey: 'COMMON.MEDICINE' },
            { field: 'medicineType', header: 'Medicine Type', headerKey: 'COMMON.MEDICINE_TYPE' },
            { field: 'dosage', header: 'Dosage', headerKey: 'COMMON.DOSAGE' },
            { field: 'quantity', header: 'Quantity', headerKey: 'COMMON.QUANTITY' },
            { field: 'frequency', header: 'Frequency', headerKey: 'COMMON.FREQUENCY' },
            { field: 'numberOfDays', header: 'Number Of Days', headerKey: 'COMMON.NUMBER_OD_DAYS' }
        ];
    
     this.diagnosisCols = [
            { field: 'diagnosis', header: 'Diagnosis', headerKey: 'COMMON.DIAGNOSIS' },
            { field: 'instructions', header: 'Instructions', headerKey: 'COMMON.INSTRUCTIONS'}
        ];
    
    
     this.addNewDiagnosisRow();
     this.addNewMedicineRow();

  this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }
 
  
  updateCols() {
    for (var index in this.medicineCols) {
      let col = this.medicineCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
    
    
    for (var index in this.diagnosisCols) {
      let col = this.diagnosisCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
  
  addNewMedicineRow() {
    let pm =  new PrescriptionMedicine();
    pm.medicine = new Product();
    this.prescription.prescriptionMedicines.push(pm);
  }
  
  addNewDiagnosisRow() {
    let pd =  new PrescriptionDiagnosis();
    this.prescription.prescriptionDiagnoses.push(pd);
  }
  
  addNew() {
    this.prescription = new Prescription();
    this.addNewDiagnosisRow();
    this.addNewMedicineRow();
  }
  
  ngOnDestroy() {
    this.prescription = null;
  }
  
  validate() {
    let noMedFound: boolean = true;
    
    if (this.prescription.prescriptionDatetime == null) {
      this.invalidDatetime = true;
      this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:'Prescription Datetime is required.'});
    }
    if (this.prescription.prescriptionType == null) {
      this.invalidType = true;
      this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:'Prescription Type is required.'});
    }

    for (let i in this.prescription.prescriptionMedicines) {
      let pm = this.prescription.prescriptionMedicines[i];
      if (pm.medicine.id > 0) {
        noMedFound = false;
        if (pm.dosage == null)
          this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:'Dosage is required.'});
        if (pm.quantity == null)
          this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:'Quantity is required.'});
        if (pm.frequency == null)
          this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:'Frequency is required.'});
        if (pm.numberOfDays == null)
          this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:'Number of days is required.'});
      }
    }
    
    if (noMedFound) {
      this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:'At least 1 medication is required.'});
    }
    
    return this.messages.length == 0;
  }

  save() {
    this.messages = [];
    if (!this.validate()) {
      return;
    }
    
    try {
      this.prescription.visit = this.visit;
      this.prescription.admission = this.admission;
      
      this.admissionService.savePrescription(this.prescription)
        .subscribe(result => {
          if (result.id > 0) {
            this.prescription = result;
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
  
  
  getPrescription(prescriptionId: number) {
    this.messages = [];
    this.invalidDatetime = false;
    this.invalidType = false;
    this.admissionService.getPrescription(prescriptionId)
        .subscribe(result => {
      if (result.id > 0) {
        this.prescription = result
        this.prescription.prescriptionDatetime = new Date(this.prescription.prescriptionDatetime);
        if (this.prescription.prescriptionMedicines.length == 0) {
          this.addNewMedicineRow();
        }
        if (this.prescription.prescriptionDiagnoses.length == 0) {
          this.addNewDiagnosisRow();
        }
      }
    })
  }
  
  delete() {
    
  }
}
