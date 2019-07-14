import { Component, OnInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ReferenceWithCategory } from '../../models/referenceWithCategory';
import { GenericService, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';


@Component({ 
  selector: 'app-referenceWithCategory-list',
  templateUrl: '../../pages/admin/referenceWithCategoryList.html',
  providers: [GenericService]
})
export class ReferenceWithCategoryList implements OnInit, OnDestroy {
  
  referenceWithCategories: ReferenceWithCategory[] = [];
  cols: any[];
  
  category: string;
  @Output() referenceWithCategoryIdEvent = new EventEmitter<string>();
  
  REFERENCE_WITH_CATEGORY_LIST: string;
  
  constructor
    (
    private genericService: GenericService,
    private translate: TranslateService,
    private globalEventsManager: GlobalEventsManager,
    private route: ActivatedRoute,
    private router: Router,
    ) {

    
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'categoryName', header: 'Category', headerKey: 'COMMON.CATEGORY' },
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME' },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION' },
            { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS', type:'string' }
        ];

    this.updateCols(this.category);
    this.translate.onLangChange.subscribe(() => {
      this.updateCols(this.category);
    });
  }
 
   
  updateCols(category: string) {
    for (var index in this.cols) {
      let col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
    
    let refList = "COMMON." + category + "_LIST";
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
  
  edit(referenceWithCategoryId : number) {
    try {
      this.referenceWithCategoryIdEvent.emit(referenceWithCategoryId + '');
    }
    catch (e) {
      console.log(e);
    }
  }

  delete(symmtomId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "symmtomId": symmtomId,
        }
      }
      this.router.navigate(["/admin/referenceWithCategoryDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }
  
  getAll() {
     this.route
        .queryParams
        .subscribe(() => {          
          
            let parameters: string [] = []; 
            //parameters.push('e.status = |status|0|Integer')
			
            this.genericService.getAllByCriteria(this.globalEventsManager.selectedReferenceWithCategoryType, parameters)
              .subscribe((data: ReferenceWithCategory[]) => 
              { 
                this.referenceWithCategories = data 
                console.info(this.referenceWithCategories)
              },
              error => console.log(error),
              () => console.log('Get all Symptoms complete'));
          });
  
  }

 }
