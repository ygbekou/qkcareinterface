import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Admission, DoctorOrder, User, Visit, Product } from '../../models';
import { DoctorOrderTypeDropdown, DoctorOrderPriorityDropdown, DoctorOrderKindDropdown, DoctorDropdown,
	LabTestDropdown, ProductDropdown} from '../dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GenericService, VisitService } from '../../services';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-doctorOrder-details',
  templateUrl: '../../pages/admin/doctorOrderDetails.html',
  providers: [GenericService, VisitService, DoctorDropdown, DoctorOrderTypeDropdown, ProductDropdown,
    DoctorOrderPriorityDropdown, DoctorOrderKindDropdown, LabTestDropdown]
})
export class DoctorOrderDetails extends BaseComponent implements OnInit, OnDestroy {

  doctorOrder: DoctorOrder = new DoctorOrder();
  user: User;

  @Input() admission: Admission;
  @Input() visit: Visit;
  @Output() doctorOrderSaveEvent = new EventEmitter<DoctorOrder>();

  messages: Message[] = [];

  STATUS_CLOSED_ID = Constants.DOCTOR_ORDER_STATUS_CLOSED;
  STATUS_CLOSED_NAME = Constants.DOCTOR_ORDER_STATUS_CLOSED_NAME;
  STATUS_INPROGRESS_ID = Constants.DOCTOR_ORDER_STATUS_INPROGRESS;
  STATUS_INPROGRESS_NAME = Constants.DOCTOR_ORDER_STATUS_INPROGRESS_NAME;

  constructor
    (
      public genericService: GenericService,
	  private visitService: VisitService,
	  public translate: TranslateService,
	  public confirmationService: ConfirmationService,
      private doctorOrderTypeDropdown: DoctorOrderTypeDropdown,
      private doctorOrderPriorityDropdown: DoctorOrderPriorityDropdown,
      private doctorOrderKindDropdown: DoctorOrderKindDropdown,
      private doctorDropdown: DoctorDropdown,
      private labTestDropdown: LabTestDropdown,
      private productDropdown: ProductDropdown,
    ) {
	super(genericService, translate, confirmationService);
    this.user = new User();
  }

  ngOnInit(): void {

    this.user = JSON.parse(Cookie.get('user'));
  }

  ngOnDestroy() {
    this.doctorOrder = null;
  }

  save() {

    this.messages = [];
    this.doctorOrder.visit = this.visit;
    this.doctorOrder.admission = this.admission;

    try {

//      if (this.user.userGroup.id != 1 &&
//        (this.doctorOrder.doctor == null || this.doctorOrder.doctorOrderPriority == null
//            || this.doctorOrder.receivedDatetime == null)) {
//        this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:Constants.ORDERING_DOCTOR_REQUIRED});
//        return;
//      }

      if (this.doctorOrder.doctorOrderType.id === Constants.DOCTOR_ORDER_TYPE_PHARM
        && this.doctorOrder.products.length === 0) {
        this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.DOCTOR_ORDER_MEDICINE_REQUIRED});
        return;
      }
      if (this.doctorOrder.doctorOrderType.id === Constants.DOCTOR_ORDER_TYPE_LAB
        && this.doctorOrder.products.length === 0) {
        this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.DOCTOR_ORDER_LABORATORY_REQUIRED});
        return;
      }

      this.visitService.saveDoctorOrder(this.doctorOrder)
        .subscribe(result => {
          if (result.id > 0) {
			  	this.processResult(result, this.doctorOrder, this.messages, null);
		  		this.doctorOrderSaveEvent.emit(this.doctorOrder);
          } else {
            	this.processResult(result, this.doctorOrder, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  changeStatus(statusId, statusName) {

    this.doctorOrder.status.id = statusId;
    this.doctorOrder.status.name = statusName;

    try {

      this.visitService.changeDoctorOrderStatus(this.doctorOrder)
        .subscribe(result => {
          if (result.id > 0) {
            this.doctorOrder = result;
            this.messages.push({severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL});
          } else {
            this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL});
          }
        });
    } catch (e) {
      console.log(e);
    }
  }


  getDoctorOrder(doctorOrderId: number) {
	  this.clear();
    this.visitService.getDoctorOrder(doctorOrderId)
        .subscribe(result => {
      if (result.id > 0) {
        this.doctorOrder = result;
        this.doctorOrder.doctorOrderDatetime = new Date(this.doctorOrder.doctorOrderDatetime);
		this.doctorOrder.receivedDatetime = new Date(this.doctorOrder.receivedDatetime);

		for (const index in this.doctorOrder.products) {

			const product: Product = this.doctorOrder.products[index];
			const ind = this.productDropdown.products.findIndex(x => x.id === product.id);
			this.productDropdown.products.splice(ind, 1);
		}

      }
    });
  }


//  populateServiceDropdown(event) {
//    this.serviceDropdown.getServices(this.doctorOrder.service.serviceType.id);
//  }

  clear() {
	this.doctorOrder = new DoctorOrder();
	this.productDropdown.getAllProducts();
  }

  delete() {

  }
 }
