import { Component, OnInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Bed } from '../../models/bed';
import { GenericService, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-bed-list',
  templateUrl: '../../pages/admin/bedList.html',
  providers: [GenericService]
})
export class BedList extends BaseComponent implements OnInit, OnDestroy {
  
  beds: Bed[] = [];
  cols: any[];
  
  hiddenMenu = true;
  @Output() bedIdEvent = new EventEmitter<string>();
  
  constructor
    (
    public genericService: GenericService,
	public translate: TranslateService,
	public confirmationService: ConfirmationService,
    private globalEventsManager: GlobalEventsManager,
    private route: ActivatedRoute,
    private router: Router,
    ) {
		super(genericService, translate, confirmationService);
  }

  ngOnInit(): void {
    this.cols = [
		 	{ field: 'buildingName', header: 'Building', headerKey: 'COMMON.BUILDING', style: {width: '15%', 'text-align': 'center'} },
		  	{ field: 'floorName', header: 'Floor', headerKey: 'COMMON.FLOOR', style: {width: '15%', 'text-align': 'center'} },
		   	{ field: 'roomName', header: 'Room', headerKey: 'COMMON.ROOM', style: {width: '15%', 'text-align': 'center'} },
		    { field: 'bedCategoryName', header: 'Category', headerKey: 'COMMON.CATEGORY', style: {width: '15%', 'text-align': 'center'} },
            { field: 'bedNumber', header: 'Number', headerKey: 'COMMON.BED_NUMBER', style: {width: '20%', 'text-align': 'center'} },
            { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS', style: {width: '10%', 'text-align': 'center'} }
        ];
    
    this.route
        .queryParams
        .subscribe(params => {
          
          const parameters: string [] = []; 
            
          this.genericService.getAll('Bed')
            .subscribe((data: Bed[]) => { 
              this.beds = data; 
            },
            error => console.log(error),
            () => console.log('Get all Beds complete'));
     });
    
    
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
    this.beds = null;
  }
  
  edit(bedId: number) {
    try {
      if (this.hiddenMenu) {
        this.bedIdEvent.emit(bedId + '');
      } else {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            'bedId': bedId
          }
        };
        this.router.navigate(['/admin/bedDetails'], navigationExtras);
      }
    } catch (e) {
      console.log(e);
    }
    
  }

  updateTable(bed: Bed) {
		const index = this.beds.findIndex(x => x.id === bed.id);
		
		if (index === -1) {
			this.beds.push(bed);
		} else {
			this.beds[index] = bed;
		}

	}

 }
