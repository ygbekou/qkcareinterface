import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Admission, Visit, SummaryType } from '../../models';
import { ConfirmationService } from 'primeng/api';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-summaryType-list',
  templateUrl: '../../pages/admin/summaryTypeList.html',
  providers: [GenericService, ConfirmationService]
})
export class SummaryTypeList extends BaseComponent implements OnInit, OnDestroy {

  summaryTypes: SummaryType[] = [];
  cols: any[];
  rowGroupMetadata: any;

  @Input() visit: Visit;
  @Input() admission: Admission;
  @Output() summaryTypeIdEvent = new EventEmitter<string>();

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
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME', type: 'string',
                                        style: {width: '30%', 'text-align': 'center'} }
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
    this.summaryTypes = null;
  }

  public  edit(summaryId: string) {
    this.summaryTypeIdEvent.emit(summaryId);
    return false;
  }

  updateTable(summaryType: SummaryType) {
    const index = this.summaryTypes.findIndex(x => x.id === summaryType.id);
    
		if (index === -1) {
			this.summaryTypes.unshift(summaryType);
		} else {
			this.summaryTypes[index] = summaryType;
		}

  }

	getList()  {
		this.route
        .queryParams
        .subscribe(params => {

          const parameters: string [] = [];
          this.genericService.getAllByCriteria('SummaryType', parameters, ' ORDER BY e.name ')
            .subscribe((data: SummaryType[]) => {
              this.summaryTypes = data;
            },
            error => console.log(error),
            () => console.log('Get all Summary Type complete'));
        });
  }
  
 }
