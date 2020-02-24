import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { GenericService, TokenStorage, AppInfoStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { MedicineDropdown } from '../dropdowns';
import { Patient, PatientHomeMedication } from 'src/app/models';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-patientHomeMedication-page',
  templateUrl: '../../pages/admin/patientHomeMedicationPage.html',
  providers: [MedicineDropdown]
})


export class PatientHomeMedicationPage extends BaseComponent implements OnInit, OnDestroy {
  
    @Input() patient: Patient;
    patientHomeMedications: PatientHomeMedication[] = [];
    
    medicineCols: any[];
   
    constructor
    (
      public genericService: GenericService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      public medicineDropdown: MedicineDropdown,
      public appInfoStorage: AppInfoStorage,
    ) {
        super(genericService, translate, confirmationService, tokenStorage);
    }

    ngOnInit(): void {
      this.medicineCols = [
            { field: 'medicine', header: 'Medicine', headerKey: 'COMMON.MEDICINE', type: 'dropdown',
                                        style: {width: '20%', 'text-align': 'center'} },
            { field: 'medicineType', header: 'Medicine Type', headerKey: 'COMMON.MEDICINE_TYPE', type: 'string',
                                        style: {width: '30%', 'text-align': 'center'} },
            { field: 'dosage', header: 'Dosage', headerKey: 'COMMON.DOSAGE', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'} },
            { field: 'quantity', header: 'Quantity', headerKey: 'COMMON.QUANTITY', type: 'int',
                                        style: {width: '10%', 'text-align': 'center'} },
            { field: 'frequency', header: 'Frequency', headerKey: 'COMMON.FREQUENCY', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'} },
            { field: 'startDate', header: 'Start Date', headerKey: 'COMMON.START_DATE', type: 'Date' },
            { field: 'endDate', header: 'End Date', headerKey: 'COMMON.END_DATE', type: 'Date' },
            { field: 'numberOfDays', header: 'Number Of Days', headerKey: 'COMMON.NUMBER_OF_DAYS', type: 'int',
                                        style: {width: '10%', 'text-align': 'center'} }
        ];

  
      this.updateCols();
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.updateCols();
      });

      this.getHomeMedicines();
    }
    
    addNew() {
      this.patientHomeMedications.push(new PatientHomeMedication(this.patient.id));
    }
    
    remove(index: number) {
      //this.givenVaccines.splice(index - 1, 1);
    }
  
    ngOnDestroy() {
      
    }
  
   updateCols() {
    for (var index in this.medicineCols) {
      let col = this.medicineCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }

  getHomeMedicines() {
   
    const parameters: string [] = [];
    parameters.push('e.patient.id = |patientId|' + this.patient.id + '|Long');
    this.genericService.getAllByCriteria('PatientHomeMedication', parameters, ' ORDER BY e.createDate DESC ')
      .subscribe((data: PatientHomeMedication[]) => {
        this.patientHomeMedications = data;

      },
      error => console.log(error),
      () => console.log('Get all patient home medication complete'));

    }


  save(patientHomeMedication: PatientHomeMedication) {
    try {
      this.messages = [];
      
      this.genericService.save(patientHomeMedication, 'PatientHomeMedication')
        .subscribe(result => {
          if (result.id > 0) {
			      this.processResult(result, patientHomeMedication, this.messages, null);
            patientHomeMedication = result;
            patientHomeMedication.medicineName = patientHomeMedication.medicine.name;
          } else {
            this.processResult(result, patientHomeMedication, this.messages, null);
          }
        })
    } catch (e) {
      console.log(e);
    }
  }
  
 }
