import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Admission, Visit, Summary, PhysicalExam, SystemReview } from '../../models';
import { ConfirmationService, Message } from 'primeng/api';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-system-review-list',
  templateUrl: '../../pages/admin/systemReviewList.html',
  providers: [GenericService, ConfirmationService],
  styles: [`
        .no-border {
            border: none !important;
        }
    `
    ]
})
export class SystemReviewList extends BaseComponent implements OnInit, OnDestroy {

  systemReviews: SystemReview[] = [];
  cols: any[];
  rowGroupMetadata: any;

  @Input() visit: Visit;
  @Input() admission: Admission;
  @Output() systemReviewIdEvent = new EventEmitter<string>();

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
            // { field: 'summaryDatetime', header: 'Date Time', headerKey: 'COMMON.DOCTOR_ORDER_DATETIME', type: 'date_time',
            //                             style: {width: '20%', 'text-align': 'center'} },
            // { field: 'summaryTypeName', header: 'Type', headerKey: 'COMMON.DOCTOR_ORDER_TYPE', type: 'string',
            //                             style: {width: '10%', 'text-align': 'center'} },
            // { field: 'summaryStatusName', header: 'Status', headerKey: 'COMMON.STATUS', type: 'string',
            //                             style: {width: '10%', 'text-align': 'center'}  },
            // { field: 'subject', header: 'Subject', headerKey: 'COMMON.SUBJECT', type: 'string',
            //                             style: {width: '20%', 'text-align': 'center'}  },
            { field: 'shortMenu', header: 'Subject', headerKey: 'COMMON.SUBJECT', type: 'string',
                                        style: {width: '20%', 'text-align': 'center'}  },
            // { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'html',
            //                             style: {width: '30%', 'text-align': 'center'}  }
        ];

		this.getList();
    
    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }


  public updateRowGroupMetaData() {
      this.rowGroupMetadata = {};
      if (this.systemReviews) {
          for (let i = 0; i < this.systemReviews.length; i++) {
              const rowData = this.systemReviews[i];
              const systemReviewDate = rowData.systemReviewDate;
              if (i === 0) {
                  this.rowGroupMetadata[systemReviewDate] = { index: 0, size: 1 };
              } else {
                  const previousRowData = this.systemReviews[i - 1];
                  const previousRowGroup = previousRowData.systemReviewDate;
                  if (systemReviewDate === previousRowGroup) {
                      this.rowGroupMetadata[systemReviewDate].size++;
                  } else {
                      this.rowGroupMetadata[systemReviewDate] = { index: i, size: 1 };
                  }
              }
          }
      }
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
    this.systemReviews = null;
  }

  public  edit(summaryId: string) {
    this.systemReviewIdEvent.emit(summaryId);
    return false;
  }

  updateTable(systemReview: SystemReview) {
    const index = this.systemReviews.findIndex(x => x.id === systemReview.id);
    
		if (index === -1) {
			this.systemReviews.unshift(systemReview);
		} else {
			this.systemReviews[index] = systemReview;
		}

  }

	getList()  {
		this.route
        .queryParams
        .subscribe(params => {

            const parameters: string [] = [];
            if (this.visit)  {
              parameters.push('e.visit.id = |visitId|' + this.visit.id + '|Long');
            }
            if (this.admission)  {
              parameters.push('e.admission.id = |admissionId|' + this.admission.id + '|Long');
            }

            this.genericService.getAllByCriteria('SystemReview', parameters, ' ORDER BY e.systemReviewDatetime DESC ')
              .subscribe((data: SystemReview[]) => {
                this.systemReviews = data;
                this.updateRowGroupMetaData();
              },
              error => console.log(error),
              () => console.log('Get all systemReviews complete'));
          });
  }
  
 }
