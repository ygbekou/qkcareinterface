import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Admission, Visit, SummaryType, PhysicalExamTypeAssignment, SystemReviewQuestionAssignment } from '../../models';
import { ConfirmationService } from 'primeng/api';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-systemReviewQuestionAssignment-list',
  templateUrl: '../../pages/admin/systemReviewQuestionAssignmentList.html',
  providers: [GenericService, ConfirmationService]
})
export class SystemReviewQuestionAssignmentList extends BaseComponent implements OnInit, OnDestroy {

  systemReviewQuestionAssignments: SystemReviewQuestionAssignment[] = [];
  cols: any[];
  rowGroupMetadata: any;

  @Input() visit: Visit;
  @Input() admission: Admission;
  @Output() systemReviewQuestionAssignmentIdEvent = new EventEmitter<string>();

  constructor
    (
	  public genericService: GenericService,
	  public globalEventsManager: GlobalEventsManager,
    public translate: TranslateService,
    public confirmationService: ConfirmationService,
    public tokenStorage: TokenStorage,
    private route: ActivatedRoute
    ) {

    super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'roleName', header: 'Role', headerKey: 'COMMON.ROLE', type: 'string',
                                        style: {width: '30%', 'text-align': 'center'} },
            { field: 'summaryTypeName', header: 'Summary Type', headerKey: 'COMMON.SUMMARY_TYPE', type: 'string',
                                        style: {width: '30%', 'text-align': 'center'} },
            { field: 'systemReviewQuestionName', header: 'System Review Question', headerKey: 'COMMON.SYSTEM_REVIEW_QUESTION', 
                                        type: 'string', style: {width: '30%', 'text-align': 'center'} }
        ];

		this.getList();
    
    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }

  updateCols() {
    for (let index in this.cols) {
      const col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }

  ngOnDestroy() {
    this.systemReviewQuestionAssignments = null;
  }

  public  edit(summaryId: string) {
    this.systemReviewQuestionAssignmentIdEvent.emit(summaryId);
    return false;
  }

  updateTable(systemReviewQuestionAssignment: SystemReviewQuestionAssignment) {
    const index = this.systemReviewQuestionAssignments.findIndex(x => x.id === systemReviewQuestionAssignment.id);
    
		if (index === -1) {
			this.systemReviewQuestionAssignments.push(systemReviewQuestionAssignment);
		} else {
			this.systemReviewQuestionAssignments[index] = systemReviewQuestionAssignment;
		}

  }

	getList()  {
		this.route
        .queryParams
        .subscribe(params => {

          const parameters: string [] = [];
          this.genericService.getAllByCriteria('SystemReviewQuestionAssignment', parameters, 
            ' ORDER BY e.summaryType.userGroup.name, e.summaryType.name, e.systemReviewQuestion.name ')
            .subscribe((data: SystemReviewQuestionAssignment[]) => {
              this.systemReviewQuestionAssignments = data;
            },
            error => console.log(error),
            () => console.log('Get all systemReviewQuestionAssignments complete'));
        });
  }
  
 }
