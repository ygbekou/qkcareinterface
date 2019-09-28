import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Floor } from '../../models/floor';
import { Room } from '../../models/room';
import { BuildingDropdown, FloorDropdown } from '../dropdowns';
import { ConfirmationService, Message } from 'primeng/primeng';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-room-details',
  templateUrl: '../../pages/admin/roomDetails.html',
  providers: [GenericService, BuildingDropdown, FloorDropdown]
  
}) 
export class RoomDetails extends BaseComponent implements OnInit, OnDestroy {
  
  room: Room = new Room();
  messages: Message[] = [];
  
  hiddenMenu: boolean = true;
  
  buildingDropdown: BuildingDropdown;
  floorDropdown: FloorDropdown;
  @Output() roomSaveEvent = new EventEmitter<Room>();
  
  constructor
    (
      public genericService: GenericService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      private globalEventsManager: GlobalEventsManager,
      private bdgDropdown: BuildingDropdown,
      private flrDropdown: FloorDropdown,
      private route: ActivatedRoute
    ) {
		    super(genericService, translate, confirmationService, tokenStorage);
      	this.buildingDropdown = bdgDropdown;
      	this.floorDropdown = flrDropdown;
      	this.clear();
  }

  
  
  ngOnInit(): void {
    this.clear();
    let roomId = null;
    this.route
        .queryParams
        .subscribe(params => {
          roomId = params['roomId'];
          
          if (roomId != null) {
              this.genericService.getOne(roomId, 'Room')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.room = result
                }
              })
          }
        });
    
  }
  
  ngOnDestroy() {
    this.room = null;
  }

  getRoom(roomId: number) {
    this.genericService.getOne(roomId, 'Room')
        .subscribe(result => {
      if (result.id > 0) {
        this.room = result
      }
    })
  }
  
  clear() {
    this.room = new Room();
    this.room.floor = new Floor();
  }
  
  save() {
    try {
      this.messages = [];
      
      this.genericService.save(this.room, 'Room')
        .subscribe(result => {
          if (result.id > 0) {
			this.processResult(result, this.room, this.messages, null);
			this.room = result;
            this.roomSaveEvent.emit(this.room);
          }
          else {
            this.processResult(result, this.room, this.messages, null);
          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }

  
  populateFloorDropdown(event) {
    this.floorDropdown.buildingId = this.room.floor.building.id;
    this.floorDropdown.getAllFloors();
  }
  
}