import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Reference } from '../../models';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-reference-with-child-list',
  templateUrl: '../../pages/admin/referenceWithChildList.html',
  providers: [GenericService]
})
export class ReferenceWithChildList extends BaseComponent implements OnInit, OnDestroy {
  
  references: Reference[] = [];
  cols: any[];
  selectedChildReferences: any[] = [];
  selectedReferences: any[] = [];
  selectedGrandChildReferences: any[] = [];
  
  referenceType: string = null;
  parentId: number = null;
  hiddenMenu = false;
  @Input() canView: boolean;
  @Input() canDelete: boolean;
  @Output() referenceIdEvent = new EventEmitter<string>();
  
  REFERENCE_LIST_LABEL: string;
  REFERENCE_LIST: string;
  
  constructor
    (
    public genericService: GenericService,
    public translate: TranslateService,
    public confirmationService: ConfirmationService,
    public tokenStorage: TokenStorage,
    private globalEventsManager: GlobalEventsManager,
    private route: ActivatedRoute,
    private router: Router,
    ) {
		  super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    
    	this.cols = [
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME', type: 'string',
                                        style: {width: '25%', 'text-align': 'center'} },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'string',
                                        style: {width: '50%', 'text-align': 'center'} },
            { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'} }
        ];
	
		this.getAll();
	 
		this.updateCols(this.REFERENCE_LIST_LABEL);
    	this.translate.onLangChange.subscribe(() => {
      		this.updateCols(this.REFERENCE_LIST_LABEL);
    	});
  }
 
  
  getAll() {
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
          
          const parameters: string [] = []; 
          parameters.push('e.parent.id IS NULL |parentId|' + 0 + '|Long');
          
          this.genericService.getAllByCriteria(this.referenceType, parameters, ' ORDER BY e.name')
            .subscribe((data: Reference[]) => { 
              this.references = data; 
            },
            error => console.log(error),
            () => console.log('Get all Reference complete'));
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
        this.REFERENCE_LIST = res;
    });
    
    this.translate.onLangChange.subscribe(() => {
      this.updateCols(category);
    });
  }
 
  
  ngOnDestroy() {
    this.references = null;
  }
  
  edit(referenceId: number, referenceType: string) {
    try {
      if (this.hiddenMenu) {
        this.referenceIdEvent.emit(referenceId + '');
      } else {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            'referenceId': referenceId,
            'referenceType': referenceType
          }
        };
        this.router.navigate(['/admin/referenceDetails'], navigationExtras);
      }
    } catch (e) {
      console.log(e);
    }
    
  }

  updateTable(reference: Reference) {
		const index = this.references.findIndex(x => x.id === reference.id);

		if (index === -1) {
			this.references.push(reference);
		} else {
			this.references[index] = reference;
		}

  }
  
  getReferenceChilds(reference: Reference) {
      const parameters: string [] = []; 
      parameters.push('e.parent.id = |parentId|' + reference.id + '|Long');
        
      this.genericService.getAllByCriteria(this.referenceType, parameters)
      .subscribe((data: any[]) => { 
          reference.childs = data;
      },
      error => console.log(error),
      () => console.log('Get Reference List complete'));
   }

   addChild(reference: Reference) {
      reference.childs.push(new Reference());
   }

   save(childReference, parentReference) {
    this.messages = [];
    try {
      childReference.parent = new Reference();
      childReference.parent.id = parentReference.id;

      console.info(childReference);

      this.genericService.save(childReference, this.globalEventsManager.selectedReferenceType)
        .subscribe(result => {
          if (result.id > 0) {
            this.processResult(result, childReference, this.messages, null);
            childReference = result;
          } else {
            this.processResult(result, childReference, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

 }
