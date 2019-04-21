import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Reference } from '../../models/reference';
import { Constants } from '../../app.constants';
import { Floor } from '../../models/floor';
import { Room } from '../../models/room';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { BuildingDropdown, FloorDropdown } from '../dropdowns';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { User } from '../../models/user';  
import { GenericService, GlobalEventsManager } from '../../services';

@Component({
  selector: 'app-room-details',
  templateUrl: '../../pages/admin/roomDetails.html',
  providers: [GenericService, BuildingDropdown, FloorDropdown]
  
}) 
export class RoomDetails implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  room: Room = new Room();
  
  hiddenMenu: boolean = true;
  
  buildingDropdown: BuildingDropdown;
  floorDropdown: FloorDropdown;
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  
  constructor
    (
      private genericService: GenericService,
      private globalEventsManager: GlobalEventsManager,
      private bdgDropdown: BuildingDropdown,
      private flrDropdown: FloorDropdown,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {
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
                else {
                  this.error = Constants.SAVE_UNSUCCESSFUL;
                  this.displayDialog = true;
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
      else {
        this.error = Constants.SAVE_UNSUCCESSFUL;
        this.displayDialog = true;
      }
    })
  }
  
  clear() {
    this.room = new Room();
    this.room.floor = new Floor();
  }
  
  save() {
    try {
      this.error = '';
      
      this.genericService.save(this.room, 'Room')
        .subscribe(result => {
          if (result.id > 0) {
            this.room = result
          }
          else {
            this.error = Constants.SAVE_UNSUCCESSFUL;
            this.displayDialog = true;
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
  
  delete() {}
}