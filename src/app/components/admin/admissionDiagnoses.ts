import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Admission, AdmissionDiagnosis, Diagnosis, Reference, Visit, User } from '../../models';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DiagnosisDropdown } from '../dropdowns';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { GenericService, GlobalEventsManager, AdmissionService } from '../../services';
import { Message } from 'primeng/api';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({ 
  selector: 'app-admissionDiagnoses',
  templateUrl: '../../pages/admin/admissionDiagnoses.html',
  providers: [GenericService, AdmissionService, DiagnosisDropdown]
  
}) 
export class AdmissionDiagnoses extends BaseComponent implements OnInit, OnDestroy {
  
  admissionDiagnosis: AdmissionDiagnosis = new AdmissionDiagnosis();
   
  diagnosisCols: any[];
  admissionDiagnoses: AdmissionDiagnosis[] = [];
  parentId: number;
  parentEntity: string;
  entity: string;
   
  @Input() admission: Admission;
  @Input() visit: Visit;
  
  messages: Message[] = [];
  
  constructor
    (
      private admissionService: AdmissionService,
      private genericService: GenericService,
      private translate: TranslateService,
      private globalEventsManager: GlobalEventsManager,
      private diagnosisDropdown: DiagnosisDropdown,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {
		super(translate);
      	this.clear();
  }

  
  ngOnInit(): void {
    
    this.diagnosisCols = [
            { field: 'name', parent:'diagnosis', header: 'Name', headerKey: 'COMMON.NAME' },
            { field: 'description', parent:'diagnosis', header: 'Description', headerKey: 'COMMON.DESCRIPTION' },
            { field: 'instructions', header: 'Instructions', headerKey: 'COMMON.INSTRUCTIONS' }
        ];
    
    this.admissionDiagnoses.push(new AdmissionDiagnosis());
    
    if (this.visit && this.visit.id > 0){
      this.parentId = this.visit.id;
      this.parentEntity = 'visit';
      this.entity = 'VisitDiagnosis';
    }
    if (this.admission && this.admission.id > 0){
      this.parentId = this.admission.id;
      this.parentEntity = 'admission';
      this.entity = 'AdmissionDiagnosis';
    }
  

    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }
 
  
  updateCols() {
    for (var index in this.diagnosisCols) {
      let col = this.diagnosisCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
  ngOnDestroy() {
    this.admissionDiagnosis = null;
  }
  
  addNew() {
    this.admissionDiagnoses.push(new AdmissionDiagnosis());
  }
  
  remove(index: number) {
      this.admissionDiagnoses.splice(index - 1, 1);
  }
  
  saveDiagnosis(rowData: AdmissionDiagnosis) {
    if (!rowData.diagnosis || !(rowData.diagnosis.id > 0)) {
      this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:Constants.DIAGNOSIS_REQUIRED});
      return;
    }
    rowData.admission = this.admission;
    rowData.visit = this.visit;
    
    try {
      
      this.genericService.save(rowData, this.entity)
        .subscribe(result => {
          if (result.id > 0) {
            rowData = result;
            this.processResult(result, rowData, this.messages, null);
          }
          else {
            this.processResult(result, rowData, this.messages, null);
          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }
  
  clear() {
    this.admissionDiagnosis = new AdmissionDiagnosis();
    this.admissionDiagnosis.admission = new Admission();
    this.admissionDiagnosis.diagnosis = new Diagnosis()
  }
  
  getDiagnoses() {
    
    this.admissionService.getDiagnoses(+this.parentId, this.parentEntity)
     .subscribe((data: AdmissionDiagnosis[]) => 
      { 
        this.admissionDiagnoses = data;
        if (this.admissionDiagnoses != null 
              && this.admissionDiagnoses.length == 0) {
          let ad = new AdmissionDiagnosis();
          ad.diagnosis = new Diagnosis();
          this.admissionDiagnoses.push(new AdmissionDiagnosis());
        }
      },
      error => console.log(error),
      () => console.log('Get Patient Diagnoses complete'));
  }
}