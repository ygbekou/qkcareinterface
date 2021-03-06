import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Room } from '../../models';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ConfirmationService } from 'primeng';
import { GenericService, TokenStorage } from '../../services';
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
  
  hiddenMenu = true;
  @Output() roomIdEvent = new EventEmitter<string>();
  
  constructor
    (
    public genericService: GenericService,
    public translate: TranslateService,
    public confirmationService: ConfirmationService,
    public tokenStorage: TokenStorage,
    private route: ActivatedRoute,
    private router: Router,
    ) {
		super(genericService, translate, confirmationService, tokenStorage);
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
          
          const parameters: string [] = []; 
            
          this.genericService.getAll('Room')
            .subscribe((data: Room[]) => { 
              this.rooms = data; 
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
    // tslint:disable-next-line: forin
    for (const index in this.cols) {
      const col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
 
  
  ngOnDestroy() {
    this.rooms = null;
  }
  
  edit(roomId: number) {
    try {
      if (this.hiddenMenu) {
        this.roomIdEvent.emit(roomId + '');
      } else {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            'roomId': roomId
          }
        };
        this.router.navigate(['/admin/roomDetails'], navigationExtras);
      }
    } catch (e) {
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
