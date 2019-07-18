import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Admission, Investigation, InvestigationTest, Visit, SearchCriteria } from '../../models';
import { Router, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { ToolbarModule, ConfirmationService } from 'primeng/primeng';
import { GenericService, InvestigationService, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({ 
  selector: 'app-investigation-list',
  templateUrl: '../../pages/admin/investigationList.html',
  providers: [GenericService, InvestigationService, ToolbarModule] 
})
export class InvestigationList extends BaseComponent implements OnInit, OnDestroy {
  
  investigations: Investigation[] = [];
  selectedInvestigations: any[] = [];
  selectedInvestigation: Investigation;
  cols: any[];
  iTCols: any[];
  
  @Input() showActions = true;
  @Input() admission: Admission;
  @Input() visit: Visit;
  @Output() investigationIdEvent = new EventEmitter<string>();
  
  parentSelection: any[] = [];
  
  actionType: string;
  actionDatetime: Date;
  actionComments: string;
  display: boolean;
  
  searchCriteria: SearchCriteria = new SearchCriteria();
  
  
  constructor
    (
    private globalEventsManager: GlobalEventsManager,
    public genericService: GenericService,
    private investigationService: InvestigationService,
	public translate: TranslateService,
	public confirmationService: ConfirmationService,
    private router: Router,
    ) {
		super(genericService, translate, confirmationService);
  }

  ngOnInit(): void {
    	this.cols = [
			{ field: 'investigationDatetime', header: 'Investigation Datetime', headerKey: 'COMMON.INVESTIGATION_DATETIME', 
										type: 'Datetime', style: {width: '12%', 'text-align': 'center'} },
			{ field: 'name', header: 'Name', headerKey: 'COMMON.NAME', type: 'string', 
										style: {width: '15%', 'text-align': 'center'} },
            { field: 'labTestName', header: 'LabTest/Group', headerKey: 'COMMON.LAB_TEST_GROUP', type: 'string',
										style: {width: '15%', 'text-align': 'center'} },
            { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS', type: 'string',
                                        style: {width: '15%', 'text-align': 'center'} },
            { field: 'collectionDatetime', header: 'Coll Date', headerKey: 'COMMON.COLLECTION_DATE', type: 'Datetime',
                                        style: {width: '12%', 'text-align': 'center'} },
            { field: 'finalizationDatetime', header: 'Finalized Date', headerKey: 'COMMON.FINALIZED_DATE', type: 'Datetime',
                                        style: {width: '12%', 'text-align': 'center'} }
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
		
  }
 
  
  ngOnDestroy() {
    this.investigations = null;
  }
  
  edit(investigationId: number) {
	try {
		const navigationExtras: NavigationExtras = {
			queryParams: {
				'investigationId': investigationId,
			}
		};
		this.router.navigate(['/admin/investigationDetails'], navigationExtras);
	} catch (e) {
		console.log(e);
	}
  }
  
  updateCols() {
    for (let index in this.cols) {
      const col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
    
    for (let index in this.iTCols) {
      const col = this.iTCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
  
  getInvestigations() {
     
      const parameters: string [] = []; 
            
      if (this.visit && this.visit.id > 0)  {
         parameters.push('e.visit.id = |visitId|' + this.visit.id + '|Long');
         parameters.push('e.status = |status|4|Integer');
      } 
      if (this.admission && this.admission.id > 0)  {
         parameters.push('e.admission.id = |admissionId|' + this.admission.id + '|Long');
         parameters.push('e.status = |status|4|Integer');
	  } 
	  
	  if (parameters.length > 0) {
		this.genericService.getAllByCriteria('Investigation', parameters, ' ORDER BY e.investigationDatetime DESC ')
			.subscribe((data: Investigation[]) => {
				this.investigations = data;
			},
			error => console.log(error),
			() => console.log('Get Investigations complete'));
		}
        
  }
  
   getInvestigationTests(investigation: Investigation) {
      const parameters: string [] = []; 
      parameters.push('e.investigation.id = |investigationId|' + investigation.id + '|Long');
        
      this.genericService.getAllByCriteria('InvestigationTest', parameters)
      .subscribe((data: any[]) => { 
          investigation.investigationTests = data;
      },
      error => console.log(error),
      () => console.log('Get LabTest List complete'));
   }
  
  
  showInvestigationDialog(actionType: string, rowData: Investigation) {
    this.actionType = actionType;
	this.selectedInvestigation = rowData;
	this.actionDatetime = new Date();
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
            this.processResult(result, this.selectedInvestigation, this.messages, null);
          });
    } catch (e) {
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
	} else if (investigation.status === 3) {
      statusDesc = 'In Progress';
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
		this.processResult(result, investigationTest, this.messages, null);
		});
  }

  search() {
		this.searchCriteria.investigationDateEnd = null;
		this.searchCriteria.investigationDateStart = null;

		if ((this.searchCriteria.investigationDate === undefined || this.searchCriteria.investigationDate === null)
			&& (this.searchCriteria.visitId === undefined || this.searchCriteria.visitId === null)
			&& (this.searchCriteria.admissionId === undefined || this.searchCriteria.admissionId === null)
			&& (this.searchCriteria.medicalRecordNumber === undefined || this.searchCriteria.medicalRecordNumber === '') ) {
			return;
		}

		if (this.searchCriteria.investigationDate != null) {
			const startDate = new Date(new Date().setDate(this.searchCriteria.investigationDate.getDate()));
			const endDate = new Date(new Date().setDate(this.searchCriteria.investigationDate.getDate() + 1));
			this.searchCriteria.investigationDateStart = startDate.toLocaleDateString(this.globalEventsManager.LOCALE,
                Constants.LOCAL_DATE_OPTIONS);
			this.searchCriteria.investigationDateEnd = endDate.toLocaleDateString(this.globalEventsManager.LOCALE,
                Constants.LOCAL_DATE_OPTIONS);
		}



		this.investigationService.searchInvestigations(this.searchCriteria)
			.subscribe((data: Investigation[]) => {
				this.investigations = data;
			},
			error => console.log(error),
			() => console.log('Get Investigations complete'));
	}
  
 }
