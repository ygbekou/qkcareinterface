import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Bed, Floor, Room } from '../../models';
import { Constants } from '../../app.constants';
import { BuildingDropdown, FloorDropdown, RoomDropdown, CategoryDropdown } from '../dropdowns';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService} from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-bed-details',
  templateUrl: '../../pages/admin/bedDetails.html',
  providers: [GenericService, BuildingDropdown, FloorDropdown, RoomDropdown, CategoryDropdown]
  
}) 
export class BedDetails extends BaseComponent implements OnInit, OnDestroy {
  
  bed: Bed = new Bed();
  hiddenMenu: boolean = true;
  
  messages: Message[] = [];
  @Output() bedSaveEvent = new EventEmitter<Bed>();
 
  constructor
    (
      public genericService: GenericService,
	    public translate: TranslateService,
      public confirmationService: ConfirmationService,  
      public tokenStorage: TokenStorage,
      private globalEventsManager: GlobalEventsManager,
      private buildingDropdown: BuildingDropdown,
      private floorDropdown: FloorDropdown,
      private roomDropdown: RoomDropdown,
      private categoryDropdown: CategoryDropdown,
      private route: ActivatedRoute
    ) {
		super(genericService, translate, confirmationService, tokenStorage);
      	this.clear();
  }

  
  ngOnInit(): void {
    this.clear();
    this.categoryDropdown.getAllCategories(Constants.CATEGORY_BED);
    let bedId = null;
    this.route
        .queryParams
        .subscribe(params => {
          bedId = params['bedId'];
          
          if (bedId != null) {
              this.genericService.getOne(bedId, 'Bed')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.bed = result;
                }
              });
          }
        });
    
  }
  
  ngOnDestroy() {
    this.bed = null;
  }

  getBed(bedId: number) {
    this.genericService.getOne(bedId, 'Bed')
        .subscribe(result => {
      if (result.id > 0) {
        this.bed = result;
      }
    });
  }
  
  clear() {
    this.bed = new Bed();
    this.bed.room = new Room();
    this.bed.room.floor = new Floor();
  }
  
  save() {
    try {
      this.messages = [];
      
      this.genericService.save(this.bed, 'Bed')
        .subscribe(result => {
          if (result.id > 0) {
			this.processResult(result, this.bed, this.messages, null);
			this.bed = result;
			this.bedSaveEvent.emit(this.bed);
          } else {
            this.processResult(result, this.bed, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }
  
  populateFloorDropdown(event) {
    this.floorDropdown.buildingId = this.bed.room.floor.building.id;
    this.floorDropdown.getAllFloors();
  }
  
   populateRoomDropdown(event) {
    this.roomDropdown.floorId = this.bed.room.floor.id;
    this.roomDropdown.getAllRooms();
  }
  
}