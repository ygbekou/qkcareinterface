import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Admission, Visit, Summary } from '../../models';
import { ConfirmationService, Message } from 'primeng/api';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-summary-list',
  templateUrl: '../../pages/admin/summaryList.html',
  providers: [GenericService, ConfirmationService],
  styles: [`
        .no-border {
            border: none !important;
        }
    `
    ]
})
export class SummaryList extends BaseComponent implements OnInit, OnDestroy {

  summaries: Summary[] = [];
  cols: any[];
  rowGroupMetadata: any;

  @Input() visit: Visit;
  @Input() admission: Admission;
  @Output() summaryIdEvent = new EventEmitter<string>();
  @Input() summaryTypeId: string;

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
      if (this.summaries) {
          for (let i = 0; i < this.summaries.length; i++) {
              const rowData = this.summaries[i];
              const summaryDate = rowData.summaryDate;
              if (i === 0) {
                  this.rowGroupMetadata[summaryDate] = { index: 0, size: 1 };
              } else {
                  const previousRowData = this.summaries[i - 1];
                  const previousRowGroup = previousRowData.summaryDate;
                  if (summaryDate === previousRowGroup) {
                      this.rowGroupMetadata[summaryDate].size++;
                  } else {
                      this.rowGroupMetadata[summaryDate] = { index: i, size: 1 };
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
    this.summaries = null;
  }

  public  edit(summaryId: string) {
    this.summaryIdEvent.emit(summaryId);
    return false;
  }

  updateTable(summary: Summary) {
    const index = this.summaries.findIndex(x => x.id === summary.id);
    
		if (index === -1) {
			this.summaries.unshift(summary);
		} else {
			this.summaries[index] = summary;
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

            if (this.summaryTypeId)  {
              parameters.push('e.summaryType.id IN |summaryTypeId|' + this.summaryTypeId + '|List');
            }

            this.genericService.getAllByCriteria('Summary', parameters, ' ORDER BY e.summaryDatetime DESC ')
              .subscribe((data: Summary[]) => {
                this.summaries = data;
                this.updateRowGroupMetaData();
              },
              error => console.log(error),
              () => console.log('Get all Summaries complete'));
          });
  }
  
 }
