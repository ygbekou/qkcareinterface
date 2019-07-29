import { Component, OnInit, OnDestroy, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { Department } from '../../models';
import { Constants } from '../../app.constants';
import { GenericService } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-department-details',
  templateUrl: '../../pages/admin/departmentDetails.html',
  providers: [GenericService]

})

// tslint:disable-next-line:component-class-suffix
export class DepartmentDetails extends BaseComponent implements OnInit, OnDestroy {

    department: Department = new Department();
    messages: Message[] = [];
    @Output() departmentSaveEvent = new EventEmitter<Department>();

    constructor
    (
      public genericService: GenericService,
	  public translate: TranslateService,
	  public confirmationService: ConfirmationService
    ) {
		super(genericService, translate, confirmationService);
      	this.department = new Department();
  }



  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.department = null;
  }

  getDepartment(departmentId: number) {
    this.messages = [];
    this.genericService.getOne(departmentId, 'Department')
        .subscribe(result => {
      if (result.id > 0) {
        this.department = result;
      } else {
        this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
          this.messages.push({severity:
            Constants.ERROR, summary:
            res['COMMON.READ'], detail:
            res['MESSAGE.READ_FAILED']});
        });
      }
    });
  }
  
  clear() {
    this.department = new Department();
  }


  save() {
     try {
        this.genericService.save(this.department, 'Department')
          .subscribe(result => {
            if (result.id > 0) {
				this.processResult(result, this.department, this.messages, null);
				this.department = result;
				this.departmentSaveEvent.emit(this.department);
			} else {
				this.processResult(result, this.department, this.messages, null);
			}
          });
    } catch (e) {
      console.log(e);
    }
  }

  delete() {}


 }
