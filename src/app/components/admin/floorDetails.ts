import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Reference } from '../../models/reference';
import { DepartmentDropdown } from '../dropdowns/dropdown.department';
import { Constants } from '../../app.constants';
import { Floor } from '../../models/floor';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { BuildingDropdown } from '../dropdowns';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { User } from '../../models/user';  
import { GenericService, GlobalEventsManager } from '../../services';

@Component({
  selector: 'app-floor-details',
  templateUrl: '../../pages/admin/floorDetails.html',
  providers: [GenericService, BuildingDropdown]
  
})
export class FloorDetails implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  floor: Floor = new Floor();
  
  hiddenMenu: boolean = true;
  
  buildingDropdown: BuildingDropdown;
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  
  constructor
    (
      private genericService: GenericService,
      private globalEventsManager: GlobalEventsManager,
      private bdgDropdown: BuildingDropdown,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {this.buildingDropdown = bdgDropdown;
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
                  this.floor = result
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
    this.floor = null;
  }

  getFloor(floorId: number) {
    this.genericService.getOne(floorId, 'Floor')
        .subscribe(result => {
      if (result.id > 0) {
        this.floor = result
      }
      else {
        this.error = Constants.SAVE_UNSUCCESSFUL;
        this.displayDialog = true;
      }
    })
  }
  
  clear() {
    this.floor = new Floor();
  }
  
  save() {
    try {
      this.error = '';
      
      this.genericService.save(this.floor, 'Floor')
        .subscribe(result => {
          if (result.id > 0) {
            this.floor = result
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

  delete() {}
  
 }
