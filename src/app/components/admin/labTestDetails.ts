import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { LabTest } from '../../models/labTest';
import { LabTestMethodDropdown, LabTestGroupDropdown, LabTestUnitDropdown } from '../dropdowns';
import { GenericService } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, Message } from 'primeng/api';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-labTest-details',
  templateUrl: '../../pages/admin/labTestDetails.html',
  providers: [GenericService, LabTestMethodDropdown, LabTestGroupDropdown, LabTestUnitDropdown]
})
export class LabTestDetails extends BaseComponent implements OnInit, OnDestroy {
  
  labTest: LabTest = new LabTest();
  labTestMethodDropdown: LabTestMethodDropdown;
  labTestGroupDropdown: LabTestGroupDropdown;
  labTestUnitDropdown: LabTestUnitDropdown;

  messages: Message[] = [];

  @Output() labTestSaveEvent = new EventEmitter<LabTest>();
  
  constructor
    (
	  public genericService: GenericService,
	  public translate: TranslateService,
	  public confirmationService: ConfirmationService,
      ltMethodDropdown: LabTestMethodDropdown,
      ltGroupDropdown: LabTestGroupDropdown,
      ltUnitDropdown: LabTestUnitDropdown    ) {

		super(genericService, translate, confirmationService);
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
    })
  }
  
  save() {
    try {
	  this.messages = [];
	  console.info(this.labTest)
      this.genericService.saveWithUrl('/service/laboratory/investigationTest/labTest/save', this.labTest)
        .subscribe(result => {
          if (result.id > 0) {
			this.processResult(result, this.labTest, this.messages, null);
			this.labTestSaveEvent.emit(this.labTest);
          } else {
            this.processResult(result, this.labTest, this.messages, null);
          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }
  
  clear() {
	this.messages = [];
	this.labTest = new LabTest();
  }

 }
