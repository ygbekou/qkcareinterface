import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Reference, User } from '../models';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../app.constants';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { GenericService, GlobalEventsManager } from '../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-reference-list',
  templateUrl: '../pages/referenceList.html',
  providers: [GenericService]
})
export class ReferenceList implements OnInit, OnDestroy {
  
  references: Reference[] = [];
  cols: any[];
  
  referenceType: string = null;
  parentId: number = null;
  hiddenMenu: boolean = false;
  @Output() referenceIdEvent = new EventEmitter<string>();
  
  REFERENCE_LIST_LABEL: string;
  REFERENCE_LIST: string;
  
  constructor
    (
    private genericService: GenericService,
    private translate: TranslateService,
    private globalEventsManager: GlobalEventsManager,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    ) {
  }

  ngOnInit(): void {
    
    this.cols = [
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME' },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION' },
            { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS' }
        ];
    
    this.route
        .queryParams
        .subscribe(params => {
          this.referenceType = params['referenceType'];
          if (this.referenceType == null) {
            this.referenceType = this.globalEventsManager.selectedReferenceType;
            this.hiddenMenu = true;
          } else {
            this.hiddenMenu = false;
          }
          
          this.parentId = params['parentId'];
          if (this.parentId == null) {
            this.parentId = this.globalEventsManager.selectedParentId;
          } 
          
          let parameters: string [] = []; 
            
          if (this.parentId != null && this.referenceType == 'Category') {
            parameters.push('e.parent.id = |parentId|' + this.parentId + '|Long')
          } 
          
          this.genericService.getAllByCriteria(this.referenceType, parameters)
            .subscribe((data: Reference[]) => 
            { 
              this.references = data 
            },
            error => console.log(error),
            () => console.log('Get all Authors complete'));
     });
    
    
    this.updateCols(this.REFERENCE_LIST_LABEL);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols(this.REFERENCE_LIST_LABEL);
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
        this.REFERENCE_LIST = res;
    });
    
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols(category);
    });
  }
 
  
  ngOnDestroy() {
    this.references = null;
  }
  
  edit(referenceId : number, referenceType) {
    try {
      if (this.hiddenMenu) {
        this.referenceIdEvent.emit(referenceId + '');
      } else {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            "referenceId": referenceId,
            "referenceType": referenceType
          }
        }
        this.router.navigate(["/admin/referenceDetails"], navigationExtras);
      }
    }
    catch (e) {
      console.log(e);
    }
    
  }

  delete(referenceId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "referenceId": referenceId,
        }
      }
      this.router.navigate(["/admin/referenceDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

 }
