import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { Floor, User, Reference } from '../../models';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { } from 'primeng/primeng';
import { GenericService, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-floor-list',
  templateUrl: '../../pages/admin/floorList.html',
  providers: [GenericService]
})
export class FloorList implements OnInit, OnDestroy {
  
  floors: Floor[] = [];
  cols: any[];
  
  hiddenMenu: boolean = true;
  @Output() floorIdEvent = new EventEmitter<string>();
  
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
            { field: 'status', header: 'Status', headerKey: 'COMMON.STATUS' }
        ];
    
    this.route
        .queryParams
        .subscribe(params => {
          
          let parameters: string [] = []; 
            
          this.genericService.getAll('Floor')
            .subscribe((data: Floor[]) => 
            { 
              this.floors = data 
            },
            error => console.log(error),
            () => console.log('Get all Floors complete'));
     });
    
    
    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }
 
  
  updateCols() {
    for (var index in this.cols) {
      let col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
 
  
  ngOnDestroy() {
    this.floors = null;
  }
  
  edit(floorId : number) {
    try {
      if (this.hiddenMenu) {
        this.floorIdEvent.emit(floorId + '');
      } else {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            "floorId": floorId
          }
        }
        this.router.navigate(["/admin/floorDetails"], navigationExtras);
      }
    }
    catch (e) {
      console.log(e);
    }
    
  }

  delete(floorId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "floorId": floorId,
        }
      }
      this.router.navigate(["/admin/floorDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

 }
