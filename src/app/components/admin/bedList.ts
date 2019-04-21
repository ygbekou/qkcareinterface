import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Reference } from '../../models/reference';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { Bed } from '../../models/bed';
import { Floor } from '../../models/floor';
import { Room } from '../../models/room';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { User } from '../../models/user';  
import { GenericService, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-bed-list',
  templateUrl: '../../pages/admin/bedList.html',
  providers: [GenericService]
})
export class BedList implements OnInit, OnDestroy {
  
  beds: Bed[] = [];
  cols: any[];
  
  hiddenMenu: boolean = true;
  @Output() bedIdEvent = new EventEmitter<string>();
  
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
            { field: 'bedNumber', header: 'Number', headerKey: 'COMMON.BED_NUMBER' },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION' },
            { field: 'status', header: 'Status', headerKey: 'COMMON.STATUS' }
        ];
    
    this.route
        .queryParams
        .subscribe(params => {
          
          let parameters: string [] = []; 
            
          this.genericService.getAll('Bed')
            .subscribe((data: Bed[]) => 
            { 
              this.beds = data 
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
    for (var index in this.cols) {
      let col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
  
  ngOnDestroy() {
    this.beds = null;
  }
  
  edit(bedId : number) {
    try {
      if (this.hiddenMenu) {
        this.bedIdEvent.emit(bedId + '');
      } else {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            "bedId": bedId
          }
        }
        this.router.navigate(["/admin/bedDetails"], navigationExtras);
      }
    }
    catch (e) {
      console.log(e);
    }
    
  }

  delete(bedId: number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "bedId": bedId,
        }
      }
      this.router.navigate(["/admin/bedDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

 }
