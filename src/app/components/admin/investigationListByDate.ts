import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Admission, Investigation, InvestigationTest, Visit, SearchCriteria } from '../../models';
import { Router, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { ToolbarModule, ConfirmationService } from 'primeng';
import { GenericService, InvestigationService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({ 
  selector: 'app-investigation-list-bydate',
  templateUrl: '../../pages/admin/investigationListByDate.html',
  providers: [GenericService, InvestigationService, ToolbarModule],
  styles: [`
        .loading-text {
            display: block;
            background-color: #f1f1f1;
            min-height: 19px;
            animation: pulse 1s infinite ease-in-out;
            text-indent: -99999px;
            overflow: hidden;
        }
    `]
})
export class InvestigationListByDate extends BaseComponent implements OnInit, OnDestroy {
  
  investigationTests: any[] = [];
  investigationResults: any[] = [];
  selectedInvestigation: Investigation;
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
  listMessage = '';

  filteredTestName: string;
  testNames: string[] = [];
  
  
  constructor
    (
    private globalEventsManager: GlobalEventsManager,
    public genericService: GenericService,
    private investigationService: InvestigationService,
    public translate: TranslateService,
    public confirmationService: ConfirmationService,
    public tokenStorage: TokenStorage,
    private router: Router,
    ) {
		  super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    
    
    this.iTCols = [];
    
		this.updateCols();
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      
		this.updateCols();
		});

		this.getInvestigationTests();
		
  }
 
  
  ngOnDestroy() {
    this.investigationTests = null;
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
    
    for (let index in this.iTCols) {
      const col = this.iTCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
  
  getInvestigations() {
     
	  const parameters: string [] = []; 
	  this.listMessage = '';
      if (this.visit && this.visit.id > 0)  {
         parameters.push('e.investigation.visit.id = |visitId|' + this.visit.id + '|Long');
         parameters.push('e.investigation.status = |status|4|Integer');
      } 
      if (this.admission && this.admission.id > 0)  {
         parameters.push('e.investigation.admission.id = |admissionId|' + this.admission.id + '|Long');
         parameters.push('e.investigation.status = |status|4|Integer');
	  } 
	  
	  if (parameters.length > 0) {
		this.genericService.getAllByCriteria('InvestigationTest', parameters, ' ORDER BY e.investigation.investigationDatetime DESC ')
			.subscribe((data: InvestigationTest[]) => {
        this.investigationTests = data;
        this.generateListHeaders();
				this.setResponseMessage();
			},
			error => console.log(error),
			() => console.log('Get Investigations complete'));
	  } else {
		  this.setResponseMessage();
	  }
        
  }
  

  setResponseMessage() {
    this.listMessage = '';
    if (this.investigationTests.length === 0) {
      this.translate.get('MESSAGE.NO_INVESTIGATION_FOUND').subscribe((res: string) => {
        this.listMessage = res;
      });
    }
  }

  generateListHeaders() {

    let resultMap = new Map();


    this.iTCols = [];
    this.iTCols.push({field: 'name', header : 'NAME', type: 'String', style: {width: '12%', 'text-align': 'center'}})
    
    for (let index in this.investigationTests[0]['attributes']) {
      this.iTCols.push({field: this.investigationTests[0]['attributes'][index], 
        header : this.investigationTests[0]['attributes'][index], type: 'number'});
    }

    let names = new Set<string>();
    
    for (let index in this.investigationTests) {
      
      if (index === '0') {
        continue;
      }
      for (let i = 0; i < 10; i++) {
        this.investigationResults.push(this.investigationTests[index]);
        names.add(this.investigationTests[index]['name'])
      }
    }

    this.testNames = Array.from(names);

  }


   getInvestigationTests() {
      if (this.visit && this.visit.id > 0)  {
         this.searchCriteria.visitId = this.visit.id;
      } 
      if (this.admission && this.admission.id > 0)  {
         this.searchCriteria.admissionId = this.admission.id;
      } 
    
        
      this.investigationService.searchInvestigations(this.searchCriteria, '/service/laboratory/investigationTest/list/byDate')
			.subscribe((data: any[]) => {
        console.info('Here')
        console.info(data);
        this.investigationTests = data;
        this.generateListHeaders();
        this.setResponseMessage();
			},
			error => console.log(error),
			() => console.log('Get Investigations complete'));
   }
  
  
  filterByString(event) {
    if (event.query === '') {
      this.testNames = this.testNames;
    }
    this.testNames = this.testNames.filter(e => e.startsWith(event.query));

   }

  showInvestigationDialog(actionType: string, rowData: Investigation) {
    this.actionType = actionType;
	this.selectedInvestigation = rowData;
	this.actionDatetime = new Date();
    this.display = true;
  }
  
  saveAction() {
    this.messages = [];
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
    this.investigationTests = [];
		this.searchCriteria.investigationDateEnd = null;
		this.searchCriteria.investigationDateStart = null;

		if (this.isEmptyStr(this.searchCriteria.investigationDate)
			&& this.isEmptyStr(this.searchCriteria.visitId)
			&& this.isEmptyStr(this.searchCriteria.admissionId)
      && this.isEmptyStr(this.searchCriteria.medicalRecordNumber) 
      && this.isEmptyStr(this.searchCriteria.lastName)
      && this.isEmptyStr(this.searchCriteria.firstName)
      ) {
        let alertMessage = '';
        this.translate.get('MESSAGE.NO_CRITERIA_SET').subscribe((res: string) => {
          alertMessage = res;
        });
        alert(alertMessage);
        return;
    }

		if (this.searchCriteria.investigationDate != null) {
      const startDate = new Date(this.searchCriteria.investigationDate);
      let endDate = new Date(this.searchCriteria.investigationDate);
      endDate = new Date(endDate.setDate(this.searchCriteria.investigationDate.getDate() + 1));
			this.searchCriteria.investigationDateStart = startDate.toLocaleDateString(this.globalEventsManager.LOCALE,
                Constants.LOCAL_DATE_OPTIONS);
			this.searchCriteria.investigationDateEnd = endDate.toLocaleDateString(this.globalEventsManager.LOCALE,
                Constants.LOCAL_DATE_OPTIONS);
		}



		this.investigationService.searchInvestigations(this.searchCriteria, undefined)
			.subscribe((data: any[]) => {
        this.investigationTests = data;
        
        this.setResponseMessage();
			},
			error => console.log(error),
			() => console.log('Get Investigations complete'));
	}
  
 }
