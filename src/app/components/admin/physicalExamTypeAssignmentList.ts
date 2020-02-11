import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Admission, Visit, SummaryType, PhysicalExamTypeAssignment } from '../../models';
import { ConfirmationService } from 'primeng/api';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-physical-exam-type-assignment-list',
  templateUrl: '../../pages/admin/physicalExamTypeAssignmentList.html',
  providers: [GenericService, ConfirmationService]
})
export class PhysicalExamTypeAssignmentList extends BaseComponent implements OnInit, OnDestroy {

  physicalExamTypeAssignments: PhysicalExamTypeAssignment[] = [];
  cols: any[];
  rowGroupMetadata: any;

  @Input() visit: Visit;
  @Input() admission: Admission;
  @Output() physicalExamTypeAssignmentIdEvent = new EventEmitter<string>();

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
            { field: 'physicalExamTypeName', header: 'Physical Exam Type', headerKey: 'COMMON.PHYSICAL_EXAM_TYPE', type: 'string',
                                        style: {width: '30%', 'text-align': 'center'} }
        ];

		this.getList();
    
    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }

  updateCols() {
    // tslint:disable-next-line: forin
    for (const index in this.cols) {
      const col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }

  ngOnDestroy() {
    this.physicalExamTypeAssignments = null;
  }

  public  edit(summaryId: string) {
    this.physicalExamTypeAssignmentIdEvent.emit(summaryId);
    return false;
  }

  updateTable(physicalExamTypeAssignment: PhysicalExamTypeAssignment) {
    const index = this.physicalExamTypeAssignments.findIndex(x => x.id === physicalExamTypeAssignment.id);
    
		if (index === -1) {
			this.physicalExamTypeAssignments.push(physicalExamTypeAssignment);
		} else {
			this.physicalExamTypeAssignments[index] = physicalExamTypeAssignment;
		}

  }

	getList()  {
		this.route
        .queryParams
        .subscribe(params => {

          const parameters: string [] = [];
          this.genericService.getAllByCriteria('PhysicalExamTypeAssignment', parameters, 
            ' ORDER BY e.summaryType.userGroup.name, e.summaryType.name, e.physicalExamType.name ')
            .subscribe((data: PhysicalExamTypeAssignment[]) => {
              this.physicalExamTypeAssignments = data;
            },
            error => console.log(error),
            () => console.log('Get all PhysicalExamTypeAssignment complete'));
        });
  }
  
 }
