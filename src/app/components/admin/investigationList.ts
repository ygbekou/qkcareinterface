import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Admission, Employee, Investigation, InvestigationTest, Prescription, User, Visit } from '../../models';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToolbarModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { GenericService, InvestigationService, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({ 
  selector: 'app-investigation-list',
  templateUrl: '../../pages/admin/investigationList.html',
  providers: [GenericService, InvestigationService, ToolbarModule] 
})
export class InvestigationList implements OnInit, OnDestroy {
  
  error: string = '';
  message: string;
  displayDialog: boolean;
  investigations: Investigation[] = [];
  selectedInvestigations: any[] = [];
  selectedInvestigation: Investigation;
  cols: any[];
  iTCols: any[];
  
  @Input() showActions: boolean = true;
  @Input() admission: Admission;
  @Input() visit: Visit;
  @Output() investigationIdEvent = new EventEmitter<string>();
  
  parentSelection: any[] = [];
  
  actionType: string;
  actionDatetime: Date;
  actionComments: string;
  display: boolean;
  
  
  
  constructor
    (
    private globalEventsManager: GlobalEventsManager,
    private genericService: GenericService,
    private investigationService: InvestigationService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    ) {

  }

  ngOnInit(): void {
    this.cols = [
            { field: 'investigationDatetime', header: 'Date', headerKey: 'COMMON.INVESTIGATION_DATETIME', type: 'Date' },
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME' },
            { field: 'labTestName', header: 'LabTest/Group', headerKey: 'COMMON.LAB_TEST_GROUP' },
            { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS' },
            { field: 'collectionDatetime', header: 'Coll Date', headerKey: 'COMMON.COLLECTION_DATE', type: 'Date' },
            { field: 'finalizationDatetime', header: 'Finalized Date', headerKey: 'COMMON.FINALIZED_DATE', type: 'Date' }
        ];
    
    this.iTCols = [
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME' },
            { field: 'method', header: 'Method', headerKey: 'COMMON.METHOD' },
            { field: 'result', header: 'Result', headerKey: 'COMMON.RESULT' },
            { field: 'normalRange', header: 'Normal Range', headerKey: 'COMMON.NORMAL_RANGE' },
            { field: 'unit', header: 'Unit', headerKey: 'COMMON.UNIT' },
            { field: 'interpretation', header: 'Interpretation', headerKey: 'COMMON.INTERPRETATION' },
            { field: 'impression', header: 'Impression', headerKey: 'COMMON.IMPRESSION' },
            { field: 'resultDatetime', header: 'Result Date', headerKey: 'COMMON.RESULT_DATE', type: 'Date' },
            { field: 'dispatchDatetime', header: 'Dispatch Date', headerKey: 'COMMON.DISPATCH_DATE', type: 'Date' }
        ];
    
    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
    
    this.getInvestigations();

  }
 
  
  ngOnDestroy() {
    this.investigations = null;
  }
  
  edit(investigationId: string) {
    this.investigationIdEvent.emit(investigationId);
  }
  
 updateCols() {
    for (var index in this.cols) {
      let col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
    
    for (var index in this.iTCols) {
      let col = this.iTCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
  
  getInvestigations() {
     
      let parameters: string [] = []; 
            
      if (this.visit && this.visit.id > 0)  {
         parameters.push('e.visit.id = |visitId|' + this.visit.id + '|Long');
         parameters.push('e.status = |status|4|Integer');
      } 
      if (this.admission && this.admission.id > 0)  {
         parameters.push('e.admission.id = |admissionId|' + this.admission.id + '|Long');
         parameters.push('e.status = |status|4|Integer')
      } 
        
        
      this.genericService.getAllByCriteria('Investigation', parameters)
         .subscribe((data: Investigation[]) => 
          { 
            this.investigations = data 
            console.log(this.investigations)
          },
          error => console.log(error),
          () => console.log('Get all Investigations complete'));
      }
  
   getInvestigationTests(investigation: Investigation) {
     let parameters: string [] = []; 
     parameters.push('e.investigation.id = |investigationId|' + investigation.id + '|Long')
        
      this.genericService.getAllByCriteria('InvestigationTest', parameters)
      .subscribe((data: any[]) => 
      { 
          investigation.investigationTests = data;
          console.log(data)
      },
      error => console.log(error),
      () => console.log('Get LabTest List complete'));
   }
  
  
  showInvestigationDialog(actionType: string, rowData: Investigation) {
    this.actionType = actionType;
    this.selectedInvestigation = rowData;
    this.display = true;
  }
  
  saveAction() {
    
    try {
      
      if (this.actionType === 'Collection') {
        this.selectedInvestigation.status = 1;
        this.selectedInvestigation.collectionDatetime = this.actionDatetime;
        this.selectedInvestigation.collectionComments = this.actionComments;
      } else if (this.actionType === 'Rejection') {
        this.selectedInvestigation.status = 2;
        this.selectedInvestigation.rejectionDatetime = this.actionDatetime;
        this.selectedInvestigation.rejectionComments = this.actionComments;
      } else if (this.actionType === 'Finalization') {
        this.selectedInvestigation.status = 4;
        this.selectedInvestigation.finalizationDatetime = this.actionDatetime;
        this.selectedInvestigation.finalizationComments = this.actionComments;
      } 
      this.investigationService.saveInvestigaton(this.selectedInvestigation)
        .subscribe(result => {
          if (result.id > 0) {
            this.display = false;
          }
          else {
            this.error = Constants.SAVE_UNSUCCESSFUL;
            this.display = true;
          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }
  
  
  getStatusDesc(investigation: Investigation): string {
    let statusDesc = '';
    if (investigation.status === 0) {
      statusDesc = 'New';
    } else if (investigation.status === 1) {
      statusDesc = 'Collected';
    } else if (investigation.status === 2) {
      statusDesc = 'Rejected';
    } else if (investigation.status === 4) {
      statusDesc = 'Finalized';
    }
    return statusDesc; 
  }
  
  getResult(investigationTest: InvestigationTest): number {
     return Number(investigationTest.result);
  }
  
  saveResult(investigationTest: InvestigationTest) {
    this.genericService.save(investigationTest, 'InvestigationTest')
        .subscribe(result => {
          if (result.id > 0) {
            this.message = Constants.SAVE_SUCCESSFUL;
          }
          else {
            this.error = Constants.SAVE_UNSUCCESSFUL;
          }
        })
  }
  
 }
