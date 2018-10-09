import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../app.constants';
import { Admission, AdmissionDiagnosis, Diagnosis, Reference, Visit, User } from '../models';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DiagnosisDropdown } from './dropdowns';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { GenericService, GlobalEventsManager, AdmissionService } from '../services';
import { Message } from 'primeng/api';

@Component({ 
  selector: 'app-admissionDiagnoses',
  templateUrl: '../pages/admissionDiagnoses.html',
  providers: [GenericService, AdmissionService, DiagnosisDropdown]
  
}) 
export class AdmissionDiagnoses implements OnInit, OnDestroy {
  
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
      private globalEventsManager: GlobalEventsManager,
      private diagnosisDropdown: DiagnosisDropdown,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {
      this.clear();
  }

  
  ngOnInit(): void {
    
    this.diagnosisCols = [
            { field: 'name', parent:'diagnosis', header: 'Name' },
            { field: 'description', parent:'diagnosis', header: 'Description' },
            { field: 'instructions', header: 'Instructions' }
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