import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReferenceWithCategory } from '../../models/referenceWithCategory';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-reference-with-category-list',
  templateUrl: '../../pages/admin/referenceWithCategoryList.html',
  providers: [GenericService]
})
export class ReferenceWithCategoryList extends BaseComponent implements OnInit, OnDestroy {
  
  referenceWithCategories: ReferenceWithCategory[] = [];
  cols: any[];
  
  category: string;
  @Input() canView: boolean;
  @Input() canDelete: boolean;
  @Output() referenceWithCategoryIdEvent = new EventEmitter<string>();
  
  REFERENCE_WITH_CATEGORY_LIST: string;
  
  constructor
    (
    public genericService: GenericService,
    public translate: TranslateService,
    public confirmationService: ConfirmationService,
    public tokenStorage: TokenStorage,
    private globalEventsManager: GlobalEventsManager,
    private route: ActivatedRoute
    ) {
		super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'categoryName', header: 'Category', headerKey: 'COMMON.CATEGORY', type: 'string',
                                        style: {width: '20%', 'text-align': 'center'} },
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME', type: 'string',
                                        style: {width: '20%', 'text-align': 'center'} },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'string',
                                        style: {width: '40%', 'text-align': 'center'} },
            { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'} }
        ];

    this.updateCols(this.category);
    this.translate.onLangChange.subscribe(() => {
      this.updateCols(this.category);
    });
  }
 
   
  updateCols(category: string) {
    // tslint:disable-next-line: forin
    for (const index in this.cols) {
      const col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
    
    const refList = 'COMMON.' + category + '_LIST';
    this.translate.get(refList).subscribe((res: string) => {
        this.REFERENCE_WITH_CATEGORY_LIST = res;
    });
    
    this.translate.onLangChange.subscribe(() => {
      this.updateCols(category);
    });
  }
 
 
  
  ngOnDestroy() {
    this.referenceWithCategories = null;
  }
  
  edit(referenceWithCategoryId: number) {
    try {
      this.referenceWithCategoryIdEvent.emit(referenceWithCategoryId + '');
    } catch (e) {
      console.log(e);
    }
  }


  getAll() {
     this.route
        .queryParams
        .subscribe(() => {          
          
            const parameters: string [] = []; 
            //parameters.push('e.status = |status|0|Integer')
			
            this.genericService.getAllByCriteria(this.globalEventsManager.selectedReferenceWithCategoryType, parameters)
              .subscribe((data: ReferenceWithCategory[]) => { 
                this.referenceWithCategories = data; 
                console.info(this.referenceWithCategories);
              },
              error => console.log(error),
              () => console.log('Get all Symptoms complete'));
          });
  
  }


  	updateTable(referenceWithCategory: ReferenceWithCategory) {
		const index = this.referenceWithCategories.findIndex(x => x.id === referenceWithCategory.id);

		if (index === -1) {
			this.referenceWithCategories.push(referenceWithCategory);
		} else {
			this.referenceWithCategories[index] = referenceWithCategory;
		}

	}

 }
