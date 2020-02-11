import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Floor } from '../../models/floor';
import { BuildingDropdown } from '../dropdowns';
import { Message, ConfirmationService } from 'primeng';
import { GenericService, TokenStorage } from '../../services';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-floor-details',
  templateUrl: '../../pages/admin/floorDetails.html',
  providers: [GenericService, BuildingDropdown]
  
})
export class FloorDetails extends BaseComponent implements OnInit, OnDestroy {
  
  messages: Message[] = [];
  floor: Floor = new Floor();
  
  hiddenMenu = true;
  buildingDropdown: BuildingDropdown;
  @Input() canSave: boolean;
  @Output() floorSaveEvent = new EventEmitter<Floor>();
  
  constructor
    (
      public genericService: GenericService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      private bdgDropdown: BuildingDropdown,
      private route: ActivatedRoute
    ) {
      super(genericService, translate, confirmationService, tokenStorage);
      this.buildingDropdown = bdgDropdown;
      	this.floor = new Floor();
  }

  
  
  ngOnInit(): void {
    this.floor = new Floor();
    let floorId = null;
    this.route
        .queryParams
        .subscribe(params => {
          floorId = params['floorId'];
          
          if (floorId != null) {
              this.genericService.getOne(floorId, 'Floor')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.floor = result;
				}
              });
          }
        });
  }
  
  ngOnDestroy() {
    this.floor = null;
  }

  getFloor(floorId: number) {
    this.genericService.getOne(floorId, 'Floor')
        .subscribe(result => {
      if (result.id > 0) {
        this.floor = result;
      }
    });
  }
  
  clear() {
    this.floor = new Floor();
  }
  
  save() {
    try {
      this.messages = [];
      
      this.genericService.save(this.floor, 'Floor')
        .subscribe(result => {
          if (result.id > 0) {
			this.processResult(result, this.floor, this.messages, null);
			this.floor = result;
            this.floorSaveEvent.emit(this.floor);
          } else {
            this.processResult(result, this.floor, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }
  
 }
