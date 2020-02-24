import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Admission, Product, Prescription, PrescriptionDiagnosis,
        PrescriptionMedicine, Visit } from '../../models';
import { MedicineDropdown } from '../dropdowns';
import { GenericService, AdmissionService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';


@Component({
  selector: 'app-prescription-details',
  templateUrl: '../../pages/admin/prescriptionDetails.html',
  providers: [GenericService, AdmissionService, MedicineDropdown]
})
export class PrescriptionDetails extends BaseComponent implements OnInit, OnDestroy {

  prescription: Prescription = new Prescription();
  medicineCols: any[];
  diagnosisCols: any[];

  messages: Message[] = [];

  @Input() admission: Admission;
  @Input() visit: Visit;

  invalidDatetime = false;
  invalidType = false;
  @Output() prescriptionSaveEvent = new EventEmitter<Prescription>();

  constructor
    (
      public globalEventsManager: GlobalEventsManager,
      public genericService: GenericService,
      private admissionService: AdmissionService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      public medicineDropdown: MedicineDropdown
    ) {
		  super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {

     this.medicineCols = [
            { field: 'medicine', header: 'Medicine', headerKey: 'COMMON.MEDICINE', type: 'string',
                                        style: {width: '20%', 'text-align': 'center'} },
            { field: 'medicineType', header: 'Medicine Type', headerKey: 'COMMON.MEDICINE_TYPE', type: 'string',
                                        style: {width: '30%', 'text-align': 'center'} },
            { field: 'dosage', header: 'Dosage', headerKey: 'COMMON.DOSAGE', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'} },
            { field: 'quantity', header: 'Quantity', headerKey: 'COMMON.QUANTITY', type: 'int',
                                        style: {width: '10%', 'text-align': 'center'} },
            { field: 'frequency', header: 'Frequency', headerKey: 'COMMON.FREQUENCY', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'} },
            { field: 'numberOfDays', header: 'Number Of Days', headerKey: 'COMMON.NUMBER_OF_DAYS', type: 'int',
                                        style: {width: '10%', 'text-align': 'center'} }
        ];

     this.diagnosisCols = [
            { field: 'diagnosis', header: 'Diagnosis', headerKey: 'COMMON.DIAGNOSIS', type: 'string',
                                        style: {width: '30%', 'text-align': 'center'} },
            { field: 'instructions', header: 'Instructions', headerKey: 'COMMON.INSTRUCTIONS', type: 'string',
                                        style: {width: '60%', 'text-align': 'center'}}
        ];


     this.addNewDiagnosisRow();
     this.addNewMedicineRow();

  this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }


  updateCols() {
// tslint:disable-next-line: forin
    for (const index in this.medicineCols) {
      const col = this.medicineCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }


// tslint:disable-next-line: forin
    for (const index in this.diagnosisCols) {
      const col = this.diagnosisCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }

  addNewMedicineRow() {
    const pm =  new PrescriptionMedicine();
    pm.medicine = new Product();
    this.prescription.prescriptionMedicines.push(pm);
  }

  addNewDiagnosisRow() {
    const pd =  new PrescriptionDiagnosis();
    this.prescription.prescriptionDiagnoses.push(pd);
  }

  addNew() {
	this.messages = [];
    this.prescription = new Prescription();
    this.addNewDiagnosisRow();
    this.addNewMedicineRow();
  }

  ngOnDestroy() {
    this.prescription = null;
  }

  validate() {
    let noMedFound = true;

    if (this.prescription.prescriptionDatetime == null) {
	  this.invalidDatetime = true;
	  this.translate.get(['COMMON.SAVE', 'COMMON.PRESCRIPTION_DATETIME', 'VALIDATION.IS_REQUIRED']).subscribe(res => {
            this.messages.push({
                severity: Constants.ERROR, summary: res['COMMON.SAVE'],
                detail: res['COMMON.PRESCRIPTION_DATETIME'] + ' ' + res['VALIDATION.IS_REQUIRED']
            });
        });
    }
    if (this.prescription.prescriptionType == null) {
      this.invalidType = true;
      this.translate.get(['COMMON.SAVE', 'COMMON.PRESCRIPTION_TYPE', 'VALIDATION.IS_REQUIRED']).subscribe(res => {
            this.messages.push({
                severity: Constants.ERROR, summary: res['COMMON.SAVE'],
                detail: res['COMMON.PRESCRIPTION_TYPE'] + ' ' + res['VALIDATION.IS_REQUIRED']
            });
        });
    }

// tslint:disable-next-line: forin
    for (const i in this.prescription.prescriptionMedicines) {
      const pm = this.prescription.prescriptionMedicines[i];
      if (pm.medicine.id > 0) {
        noMedFound = false;
        if (pm.dosage == null) {
          this.translate.get(['COMMON.SAVE', 'COMMON.DOSAGE', 'VALIDATION.IS_REQUIRED']).subscribe(res => {
            this.messages.push({
                severity: Constants.ERROR, summary: res['COMMON.SAVE'],
                detail: res['COMMON.DOSAGE'] + ' ' + res['VALIDATION.IS_REQUIRED']
            });
        });
        }
        if (pm.quantity == null) {
          this.translate.get(['COMMON.SAVE', 'COMMON.QUANTITY', 'VALIDATION.IS_REQUIRED']).subscribe(res => {
            this.messages.push({
                severity: Constants.ERROR, summary: res['COMMON.SAVE'],
                detail: res['COMMON.QUANTITY'] + ' ' + res['VALIDATION.IS_REQUIRED']
            });
        });
        }
        if (pm.frequency == null) {
          this.translate.get(['COMMON.SAVE', 'COMMON.FREQUENCY', 'VALIDATION.IS_REUIRED']).subscribe(res => {
            this.messages.push({
                severity: Constants.ERROR, summary: res['COMMON.SAVE'],
                detail: res['COMMON.FREQUENCY'] + ' ' + res['VALIDATION.IS_REQUIRED']
            });
           });
        }
        if (pm.numberOfDays == null) {
          this.translate.get(['COMMON.SAVE', 'COMMON.NUMBER_OF_DAYS', 'VALIDATION.IS_REQUIRED']).subscribe(res => {
            this.messages.push({
                severity: Constants.ERROR, summary: res['COMMON.SAVE'],
                detail: res['COMMON.NUMBER_OF_DAYS'] + ' ' + res['VALIDATION.IS_REQUIRED']
            });
        });
        }
      }
    }

    if (noMedFound) {
      this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: 'At least 1 medication is required.'});
    }

    return this.messages.length === 0;
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
		this.processResult(result, this.prescription, this.messages, null);
		this.prescription = result;
		this.prescriptionSaveEvent.emit(this.prescription);
	});
    } catch (e) {
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
        this.prescription = result;
        this.prescription.prescriptionDatetime = new Date(this.prescription.prescriptionDatetime);
        if (this.prescription.prescriptionMedicines.length === 0) {
          this.addNewMedicineRow();
        }
        if (this.prescription.prescriptionDiagnoses.length === 0) {
          this.addNewDiagnosisRow();
        }
      }
    });
  }

}
