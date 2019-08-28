import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Admission, Investigation, InvestigationTest, Visit, SearchCriteria, RadInvestigation } from '../../models';
import { Router, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { ToolbarModule, ConfirmationService } from 'primeng/primeng';
import { GenericService, InvestigationService, GlobalEventsManager, RadInvestigationService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({ 
  selector: 'app-radInvestigation-list',
  templateUrl: '../../pages/admin/radInvestigationList.html',
  providers: [] 
})
export class RadInvestigationList extends BaseComponent implements OnInit, OnDestroy {
  
  investigations: RadInvestigation[] = [];
  selectedInvestigations: any[] = [];
  selectedInvestigation: RadInvestigation;
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
  listMessage = '';
  
  
  constructor
    (
    private globalEventsManager: GlobalEventsManager,
    public genericService: GenericService,
    private investigationService: RadInvestigationService,
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
            { field: 'examName', header: 'Exam', headerKey: 'COMMON.EXAM', type: 'string',
										style: {width: '15%', 'text-align': 'center'} },
            { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS', type: 'string',
                                        style: {width: '15%', 'text-align': 'center'} },
            { field: 'collectionDatetime', header: 'Coll Date', headerKey: 'COMMON.COLLECTION_DATE', type: 'Datetime',
                                        style: {width: '12%', 'text-align': 'center'} },
            { field: 'finalizationDatetime', header: 'Finalized Date', headerKey: 'COMMON.FINALIZED_DATE', type: 'Datetime',
                                        style: {width: '12%', 'text-align': 'center'} }
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
  
  
  updateCols() {
    for (let index in this.cols) {
      const col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
  
  getInvestigations() {
     
	  const parameters: string [] = []; 
	  this.listMessage = '';
      if (this.visit && this.visit.id > 0)  {
         parameters.push('e.visit.id = |visitId|' + this.visit.id + '|Long');
         parameters.push('e.status = |status|4|Integer');
      } 
      if (this.admission && this.admission.id > 0)  {
         parameters.push('e.admission.id = |admissionId|' + this.admission.id + '|Long');
         parameters.push('e.status = |status|4|Integer');
	  } 
	  
	  if (parameters.length > 0) {
		this.genericService.getAllByCriteria('RadInvestigation', parameters, ' ORDER BY e.investigationDatetime DESC ')
			.subscribe((data: RadInvestigation[]) => {
				this.investigations = data;
				if (this.investigations.length === 0) {
					this.translate.get('MESSAGE.NO_INVESTIGATION_FOUND').subscribe((res: string) => {
						this.listMessage = res;
					});
				}
			},
			error => console.log(error),
			() => console.log('Get Investigations complete'));
	  } else {
		  this.translate.get('MESSAGE.NO_INVESTIGATION_FOUND').subscribe((res: string) => {
				this.listMessage = res;
			});
	  }
        
  }
  
  
  getStatusDesc(investigation: RadInvestigation): string {
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

  search() {
	  	this.listMessage = '';
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
			.subscribe((data: RadInvestigation[]) => {
				this.investigations = data;
				console.info(data)
			},
			error => console.log(error),
			() => console.log('Get Investigations complete'));
	}


	edit(investigationId: number) {
		try {
			const navigationExtras: NavigationExtras = {
				queryParams: {
					'investigationId': investigationId,
				}
			};
			this.router.navigate(['/admin/radInvestigationDetails'], navigationExtras);
		} catch (e) {
			console.log(e);
		}
   }
  
 }
