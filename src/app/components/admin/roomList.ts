import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Floor, Room, Reference, User } from '../../models';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule, ConfirmationService } from 'primeng/primeng';
import { GenericService, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-room-list',
  templateUrl: '../../pages/admin/roomList.html',
  providers: [GenericService]
})
export class RoomList extends BaseComponent implements OnInit, OnDestroy {

  rooms: Room[] = [];
  cols: any[];
  
  hiddenMenu: boolean = true;
  @Output() roomIdEvent = new EventEmitter<string>();
  
  constructor
    (
    public genericService: GenericService,
	public translate: TranslateService,
	public confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router,
    ) {
		super(genericService, translate, confirmationService);
  }

  ngOnInit(): void {
    this.cols = [
			{ field: 'buildingName', header: 'Building', headerKey: 'COMMON.BUILDING', style: {width: '15%', 'text-align': 'center'} },
			{ field: 'floorName', header: 'Floor', headerKey: 'COMMON.FLOOR', style: {width: '15%', 'text-align': 'center'} },
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME', style: {width: '20%', 'text-align': 'center'} },
			{ field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION',
			 		style: {width: '30%', 'text-align': 'center'}  },
            { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS', style: {width: '10%', 'text-align': 'center'}  }
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

  updateTable(room: Room) {
		const index = this.rooms.findIndex(x => x.id === room.id);
		
		if (index === -1) {
			this.rooms.push(room);
		} else {
			this.rooms[index] = room;
		}

	}

 }
