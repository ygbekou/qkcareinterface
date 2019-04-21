import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { LabTest } from '../../models/labTest';
import { Reference } from '../../models/reference';
import { FileUploader } from './fileUploader';
import { EditorModule } from 'primeng/editor';
import { LabTestMethodDropdown, LabTestGroupDropdown, LabTestUnitDropdown } from '../dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule, MultiSelectModule, CalendarModule } from 'primeng/primeng';
import { GenericService, GlobalEventsManager } from '../../services';

@Component({
  selector: 'app-labTest-details',
  templateUrl: '../../pages/admin/labTestDetails.html',
  providers: [GenericService, LabTestMethodDropdown, LabTestGroupDropdown, LabTestUnitDropdown]
})
export class LabTestDetails implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  labTest: LabTest = new LabTest();
  labTestMethodDropdown: LabTestMethodDropdown;
  labTestGroupDropdown: LabTestGroupDropdown;
  labTestUnitDropdown: LabTestUnitDropdown;
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  DEPARTMENT: string = Constants.DEPARTMENT;
  COUNTRY: string = Constants.COUNTRY;
  ROLE: string = Constants.ROLE;
  SELECT_OPTION: string = Constants.SELECT_OPTION;
  
  constructor
    (
      private genericService: GenericService,
      private globalEventsManager: GlobalEventsManager,
      private ltMethodDropdown: LabTestMethodDropdown,
      private ltGroupDropdown: LabTestGroupDropdown,
      private ltUnitDropdown: LabTestUnitDropdown,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {
      this.labTestMethodDropdown = ltMethodDropdown;
      this.labTestGroupDropdown = ltGroupDropdown;
      this.labTestUnitDropdown = ltUnitDropdown;
  }

  ngOnInit(): void {
  }
  
  ngOnDestroy() {
    this.labTest = null;
  }

  getLabTest(labTestId: number) {
    this.genericService.getOne(labTestId, 'LabTest')
        .subscribe(result => {
      if (result.id > 0) {
        this.labTest = result
      }
      else {
        this.error = Constants.SAVE_UNSUCCESSFUL;
        this.displayDialog = true;
      }
    })
  }
  
  save() {
    try {
      this.error = '';
      this.genericService.save(this.labTest, "LabTest")
        .subscribe(result => {
          if (result.id > 0) {
            this.labTest = result
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
  
  delete() {
  
  }

 }
