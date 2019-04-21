import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Reference, Bed, Floor, Room, User  } from '../../models';
import { Constants } from '../../app.constants';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { BuildingDropdown, FloorDropdown, RoomDropdown, CategoryDropdown } from '../dropdowns';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { GenericService, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-bed-details',
  templateUrl: '../../pages/admin/bedDetails.html',
  providers: [GenericService, BuildingDropdown, FloorDropdown, RoomDropdown, CategoryDropdown]
  
}) 
export class BedDetails implements OnInit, OnDestroy {
  
  bed: Bed = new Bed();
  hiddenMenu: boolean = true;
  
  messages: Message[] = [];
 
  constructor
    (
      private genericService: GenericService,
      private translate: TranslateService,
      private globalEventsManager: GlobalEventsManager,
      private buildingDropdown: BuildingDropdown,
      private floorDropdown: FloorDropdown,
      private roomDropdown: RoomDropdown,
      private categoryDropdown: CategoryDropdown,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {
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
                  this.bed = result
                }
              })
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
    })
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
            this.bed = result;
            this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_SUCCESS']).subscribe(res => {
              this.messages.push({severity:Constants.SUCCESS, summary:res['COMMON.SAVE'], detail:res['MESSAGE.SAVE_SUCCESS']});
            });
            
          }
          else {
            this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_SUCCESS']).subscribe((res: string) => {
              this.messages.push({severity:Constants.SUCCESS, summary:res['COMMON.SAVE'], detail:res['MESSAGE.SAVE_SUCCESS']});
            });
          }
        })
    }
    catch (e) {
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
  
  delete() {}
}