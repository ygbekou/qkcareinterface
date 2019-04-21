import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Floor, Room, Reference, User } from '../../models';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { GenericService, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-room-list',
  templateUrl: '../../pages/admin/roomList.html',
  providers: [GenericService]
})
export class RoomList implements OnInit, OnDestroy {

  rooms: Room[] = [];
  cols: any[];
  
  hiddenMenu: boolean = true;
  @Output() roomIdEvent = new EventEmitter<string>();
  
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
            
          this.genericService.getAll('Room')
            .subscribe((data: Room[]) => 
            { 
              this.rooms = data 
            },
            error => console.log(error),
            () => console.log('Get all Rooms complete'));
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
    this.rooms = null;
  }
  
  edit(roomId : number) {
    try {
      if (this.hiddenMenu) {
        this.roomIdEvent.emit(roomId + '');
      } else {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            "roomId": roomId
          }
        }
        this.router.navigate(["/admin/roomDetails"], navigationExtras);
      }
    }
    catch (e) {
      console.log(e);
    }
    
  }

  delete(roomId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "roomId": roomId,
        }
      }
      this.router.navigate(["/admin/roomDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

 }
