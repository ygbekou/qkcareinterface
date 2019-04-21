import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Admission, AdmissionDiagnosis, Discharge, PrescriptionMedicine, Reference, User, Visit} from '../../models';
import { EditorModule } from 'primeng/editor';
import { DoctorDropdown } from '../dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule, MultiSelectModule, CalendarModule } from 'primeng/primeng';
import { GenericService, AdmissionService, GlobalEventsManager, VisitService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-discharge-details',
  templateUrl: '../../pages/admin/dischargeDetails.html',
  providers: [GenericService, AdmissionService, VisitService, DoctorDropdown]
})
export class DischargeDetails implements OnInit, OnDestroy {
  
  discharge: Discharge = new Discharge();
  medicineCols: any[];
  diagnosisCols: any[];
  
  dischargeReasons: Reference[] = [];
  prescriptionMedicines: PrescriptionMedicine[] = [];
  diagnoses: AdmissionDiagnosis[] = [];
  
  
  @Input() admission: Admission;
  @Input() visit: Visit;
  
  messages: Message[] = [];
  
  constructor
    (
      private globalEventsManager: GlobalEventsManager,
      private genericService: GenericService,
      private admissionService: AdmissionService,
      private visitService: VisitService,
      private translate: TranslateService,
      private doctorDropdown: DoctorDropdown,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {
  }

  ngOnInit(): void {

     this.medicineCols = [
            { field: 'medicine', header: 'Name', headerKey: 'COMMON.NAME' },
            { field: 'type', header: 'Type', headerKey: 'COMMON.TYPE' },
            { field: 'dosage', header: 'Dosage', headerKey: 'COMMON.DOSAGE' },
            { field: 'quantity', header: 'Quantity', headerKey: 'COMMON.QUANTITY' },
            { field: 'frequency', header: 'Frequency', headerKey: 'COMMON.FREQUENCY' },
            { field: 'numberOfDays', header: 'Number Of Days', headerKey: 'COMMON.NUMBER_OF_DAYS' }
        ];
    this.diagnosisCols = [
            { field: 'name', parent:'diagnosis', header: 'Name', headerKey: 'COMMON.NAME' },
            { field: 'description', parent:'diagnosis', header: 'Description', headerKey: 'COMMON.DESCRIPTION' },
            { field: 'instructions', header: 'Instructions', headerKey: 'COMMON.INSTRUCTIONS' }
        ];
    
    this.genericService.getActiveElements('dischargereason')
      .subscribe((data: Reference[]) => 
      { 
        if (data.length > 0) {
          this.dischargeReasons = data;
        }
      },
      error => console.log(error),
      () => console.log('Get ative discharge reasons complete'));
    
    let parameters: string [] = []; 
    if (this.visit && this.visit.id > 0) {
      parameters.push('e.prescription.visit.id = |visitId|' + this.visit.id + '|Long');
    } else if (this.admission && this.admission.id > 0) {
      parameters.push('e.prescription.admission.id = |admissionId|' + this.admission.id + '|Long');
    }
      parameters.push('e.prescription.isDischarge = |isDischarge|Y|String');
      parameters.push('e.prescription.status = |status|0|Integer');
    
    this.genericService.getAllByCriteria('PrescriptionMedicine', parameters)
      .subscribe((data: PrescriptionMedicine[]) => 
      { 
        this.prescriptionMedicines = data 
      },
      error => console.log(error),
      () => console.log('Get all Prescription Medicines complete'));
    
    // Get diagnoses
    let parentEntity = '';
    parameters = [];
    if (this.visit && this.visit.id > 0) {
      parameters.push('e.visit.id = |visitId|' + this.visit.id + '|Long')
      parentEntity = 'VisitDiagnosis';
    } else if (this.admission && this.admission.id > 0) {
      parameters.push('e.admission.id = |admissionId|' + this.admission.id + '|Long')
      parentEntity = 'AdmissionDiagnosis';
    }
    
    this.genericService.getAllByCriteria(parentEntity, parameters)
      .subscribe((data: AdmissionDiagnosis[]) => 
      { 
        this.diagnoses = data 
      },
      error => console.log(error),
      () => console.log('Get all diagnoses complete'));
    
    
    this.genericService.getAllByCriteria('Discharge', parameters)
      .subscribe((data: Discharge[]) => 
      { 
        if (data && data.length > 0) {
          this.discharge = data[0] 
        }
      },
      error => console.log(error),
      () => console.log('Get all diagnoses complete'));
  

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
  
  
  ngOnDestroy() {
    this.discharge = null;
  }

  save() {
    
    try {
      this.messages = [];
      if (this.visit && this.visit.id > 0) {
        this.discharge.visit = this.visit;
      }
      if (this.admission && this.admission.id > 0) {
        this.discharge.admission = this.admission;
      }
      
      let dischargeReasonId = this.discharge.dischargeReason;
      
      this.genericService.save(this.discharge, 'Discharge')
        .subscribe(result => {
          if (result.id > 0) {
            this.discharge = result;
            this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_SUCCESS']).subscribe(res => {
              this.messages.push({severity:Constants.SUCCESS, summary:res['COMMON.SAVE'], detail:res['MESSAGE.SAVE_SUCCESS']});
            });
          }
          else {
            this.translate.get(['COMMON.SAVE', 'MESSAGE.UNSAVE_SUCCESS']).subscribe(res => {
              this.messages.push({severity:Constants.SUCCESS, summary:res['COMMON.SAVE'], detail:res['MESSAGE.UNSAVE_SUCCESS']});
            });
          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }
  
  delete() {
  
  }
  
}
