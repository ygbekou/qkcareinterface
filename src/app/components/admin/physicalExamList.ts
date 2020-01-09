import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Admission, Visit, Summary, PhysicalExam } from '../../models';
import { ConfirmationService, Message } from 'primeng/api';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-physicalExam-list',
  templateUrl: '../../pages/admin/physicalExamList.html',
  providers: [GenericService, ConfirmationService],
  styles: [`
        .no-border {
            border: none !important;
        }
    `
    ]
})
export class PhysicalExamList extends BaseComponent implements OnInit, OnDestroy {

  physicalExams: PhysicalExam[] = [];
  cols: any[];
  rowGroupMetadata: any;

  @Input() visit: Visit;
  @Input() admission: Admission;
  @Output() physicalExamIdEvent = new EventEmitter<string>();

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
      if (this.physicalExams) {
          for (let i = 0; i < this.physicalExams.length; i++) {
              let rowData = this.physicalExams[i];
              let physicalExamDate = rowData.physicalExamDate;
              if (i == 0) {
                  this.rowGroupMetadata[physicalExamDate] = { index: 0, size: 1 };
              }
              else {
                  let previousRowData = this.physicalExams[i - 1];
                  let previousRowGroup = previousRowData.physicalExamDate;
                  if (physicalExamDate === previousRowGroup)
                      this.rowGroupMetadata[physicalExamDate].size++;
                  else
                      this.rowGroupMetadata[physicalExamDate] = { index: i, size: 1 };
              }
          }
      }
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
    this.physicalExams = null;
  }

  public  edit(summaryId: string) {
    this.physicalExamIdEvent.emit(summaryId);
    return false;
  }

  updateTable(physicalExam: PhysicalExam) {
    const index = this.physicalExams.findIndex(x => x.id === physicalExam.id);
    
		if (index === -1) {
			this.physicalExams.unshift(physicalExam);
		} else {
			this.physicalExams[index] = physicalExam;
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

            this.genericService.getAllByCriteria('PhysicalExam', parameters, ' ORDER BY e.physicalExamDatetime DESC ')
              .subscribe((data: PhysicalExam[]) => {
                this.physicalExams = data;
                this.updateRowGroupMetaData();
              },
              error => console.log(error),
              () => console.log('Get all physicalExams complete'));
          });
  }
  
 }
