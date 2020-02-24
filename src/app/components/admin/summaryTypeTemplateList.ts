import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Admission, Visit, SummaryTypeTemplate } from '../../models';
import { ConfirmationService } from 'primeng/api';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-summary-type-template-list',
  templateUrl: '../../pages/admin/summaryTypeTemplateList.html',
  providers: [GenericService, ConfirmationService]
})
export class SummaryTypeTemplateList extends BaseComponent implements OnInit, OnDestroy {

  summaryTypeTemplates: SummaryTypeTemplate[] = [];
  cols: any[];
  rowGroupMetadata: any;

  @Input() visit: Visit;
  @Input() admission: Admission;
  @Output() summaryTypeTemplateIdEvent = new EventEmitter<string>();

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
            { field: 'template', header: 'Template', headerKey: 'COMMON.TEMPLATE', type: 'html',
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
    this.summaryTypeTemplates = null;
  }

  public  edit(summaryTypeTemplateId: string) {
    this.summaryTypeTemplateIdEvent.emit(summaryTypeTemplateId);
    return false;
  }

  updateTable(summaryTypeTemplate: SummaryTypeTemplate) {
    const index = this.summaryTypeTemplates.findIndex(x => x.id === summaryTypeTemplate.id);
    
		if (index === -1) {
			this.summaryTypeTemplates.push(summaryTypeTemplate);
		} else {
			this.summaryTypeTemplates[index] = summaryTypeTemplate;
		}

  }

	getList()  {
		this.route
        .queryParams
        .subscribe(params => {

          const parameters: string [] = [];
          this.genericService.getAllByCriteria('SummaryTypeTemplate', parameters, 
            ' ORDER BY e.summaryType.userGroup.name, e.summaryType.name')
            .subscribe((data: SummaryTypeTemplate[]) => {
              this.summaryTypeTemplates = data;
            },
            error => console.log(error),
            () => console.log('Get all SummaryTypeTemplate complete'));
        });
  }
  
 }
