import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Appointment, Admission, Bill, BillPayment, BillService, Employee, Patient, User, Visit, 
	Service, ReportView, Parameter  } from '../../models';
import { DoctorDropdown, ServiceDropdown, PackageDropdown, LabTestDropdown, ProductDropdown } from '../dropdowns';
import { GenericService, BillingService, ReportService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';

@Component({ 
  selector: 'app-bill-details',
  templateUrl: '../../pages/admin/billDetails.html',
  providers: [GenericService, BillingService, ReportService, ServiceDropdown, DoctorDropdown]
})
export class BillDetails extends BaseComponent implements OnInit, OnDestroy {
  
  messages: Message[] = [];
  bill: Bill = new Bill();
  serviceCols: any[];
  billPaymentCols: any[];
  
  patient: Patient = new Patient();
  
  @Input() visit: Visit;
  @Input() admission: Admission;
  
  itemNumber: string;
  itemNumberLabel = 'Visit';
  reportView: ReportView = new ReportView();
  reportName: string;
  
  constructor
    (
      public genericService: GenericService,
      private billingService: BillingService,
      private reportService: ReportService,
	  public translate: TranslateService,
	  public confirmationService: ConfirmationService,
	  private serviceDropdown: ServiceDropdown,
	  private packageDropdown: PackageDropdown,
	  private labTestDropdown: LabTestDropdown,
	  private productDropdown: ProductDropdown,
      private doctorDropdown: DoctorDropdown,
      private route: ActivatedRoute
    ) {
		super(genericService, translate, confirmationService);
    	this.patient.user = new User();
  }

  ngOnInit(): void {

     this.serviceCols = [
            { field: 'serviceDate', header: 'Date', headerKey: 'COMMON.DATE', type: 'date',
										style: {width: '8%', 'text-align': 'center'}  },
			{ field: 'doctorOrderTypeName', header: 'Type', headerKey: 'COMMON.TYPE', type: 'string',
										style: {width: '15%', 'text-align': 'center'}  },
            { field: 'service', header: 'Name', headerKey: 'COMMON.NAME', type: 'string',
										style: {width: '15%', 'text-align': 'center'}  },
            //{ field: 'doctor', header: 'Doctor', headerKey: 'COMMON.DOCTOR', type: 'string',
             //                           style: {width: '15%', 'text-align': 'center'} },
            //{ field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'string',
            //                            style: {width: '15%', 'text-align': 'center'} },
            { field: 'quantity', header: 'Quantity', headerKey: 'COMMON.QUANTITY', type: 'string',
                                        style: {width: '7%', 'text-align': 'center'} },
            { field: 'unitAmount', header: 'Price', headerKey: 'COMMON.PRICE', type: 'string',
                                        style: {width: '7%', 'text-align': 'center'} },
            { field: 'totalAmount', header: 'Total', headerKey: 'COMMON.TOTAL', type: 'string',
                                        style: {width: '7%', 'text-align': 'center'} },
            { field: 'discountAmount', header: 'Discount', headerKey: 'COMMON.DISCOUNT', type: 'string',
                                        style: {width: '5%', 'text-align': 'center'} },
            { field: 'discountPercentage', header: 'Discount' + '%', headerKey: 'COMMON.DISCOUNT_PERCENTAGE', type: 'string',
                                        style: {width: '5%', 'text-align': 'center'} },
            { field: 'netAmount', header: 'Price', headerKey: 'COMMON.NET_AMOUNT', type: 'string',
                                        style: {width: '7%', 'text-align': 'center'} },
            { field: 'payerAmount', header: 'Payer Amount', headerKey: 'COMMON.PAYER_AMOUNT', type: 'string',
                                        style: {width: '7%', 'text-align': 'center'} },
            { field: 'patientAmount', header: 'Patient Amount', headerKey: 'COMMON.PATIENT_AMOUNT', type: 'string',
                                        style: {width: '7%', 'text-align': 'center'} }
        ]; 
    
      this.billPaymentCols = [
            { field: 'paymentDate', header: 'Date', headerKey: 'COMMON.DATE', type: 'date' },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'text' },
            { field: 'amount', header: 'Amount', headerKey: 'COMMON.AMOUNT', type: 'text' }
        ];
    
    let billId = null;
    this.route
        .queryParams
        .subscribe(params => {          
          
          this.bill.appointment = new Appointment();
          this.addRow();
          this.addPaymentRow();
          
          billId = params['billId'];
          
          if (billId != null) {
              this.billingService.getBill(billId)
                  .subscribe(result => {
                if (result.id > 0) {
                  this.bill = result;
                  this.admission = this.bill.admission;
                  this.visit = this.bill.visit;
                  this.bill.billDate = new Date(this.bill.billDate);
                  this.bill.dueDate = new Date(this.bill.dueDate);
                  this.addEmptyRows();
                  
                  if (this.visit != null) {
					this.itemNumberLabel = 'Visit';
				  } else if (this.admission != null) {
					this.itemNumberLabel = 'Admission';
				  }
                }
                
              });
          } else {
              
          }
     });
    
    
    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
    
  }
  
  updateCols() {
    for (var index in this.serviceCols) {
      let col = this.serviceCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
    
    for (var index in this.billPaymentCols) {
      let col = this.billPaymentCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
  
  ngOnDestroy() {
    this.messages = null;
	this.bill = null;
	this.serviceCols = null;
	this.billPaymentCols = null;
	this.patient = null;
	this.visit = null;
	this.admission = null;
	this.itemNumber = null;
	this.itemNumberLabel = null;
	this.reportView = null;
	this.reportName = null;
  }
  
  addEmptyRows() {
    if (this.bill.billServices === null || this.bill.billServices.length === 0) {
	  this.addRow();
	}
    if (this.bill.billPayments === null || this.bill.billPayments.length === 0) {
	  this.addPaymentRow();
	}
  }
  
  addRow() {
    if (this.bill.billServices == null) {
      this.bill.billServices = [];
    }
    const bs =  new BillService();
    bs.service = new Service();
    bs.doctor = new Employee();
    this.bill.billServices.push(bs);
  }
  
  addPaymentRow() {
    if (this.bill.billPayments == null) {
      this.bill.billPayments = [];
    }
    const bp =  new BillPayment();
    this.bill.billPayments.push(bp);
  }
  
  calculateGrandTotal() {
    this.bill.grandTotal = +this.getNumber(this.bill.subTotal) + +this.getNumber(this.bill.taxes)
                    - +this.getNumber(this.bill.discount);
  }
  
  calculateDue() {
    this.bill.due = +this.bill.grandTotal - +this.getNumber(this.bill.paid);
  }
  
  calculateTotal() {
    this.bill.subTotal = 0;
    for (const i in this.bill.billServices) {
       this.bill.subTotal += this.calculateRowTotal(this.bill.billServices[i]);
    }
    
    this.calculateGrandTotal();
    this.calculateDue();
  }

  calculateRowTotal(rowData) {
    rowData.totalAmount = (+this.getNumber(rowData.quantity) * +this.getNumber(rowData.unitAmount));
    rowData.netAmount = ( rowData.totalAmount - +this.getNumber(rowData.discountAmount));
	rowData.patientAmount = rowData.netAmount - +this.getNumber(rowData.payerAmount);
	
	rowData.discountPercentage = ((rowData.discountAmount * 100) / rowData.totalAmount).toFixed(2);
    return rowData.netAmount;
    
  }
  
  private getNumber(value: number): number {
    return value !== undefined ? value : 0;
  } 
  
  savePayment(rowData) {
    this.messages = [];
    rowData.data.bill = new Bill();
    rowData.data.bill.id = this.bill.id;
    
    this.genericService.saveWithUrl('/service/billing/payment/save', rowData.data)
        .subscribe(result => {
          if (result.errors == null || result.errors.length === 0) {
            this.bill = result;
            this.messages.push({severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL});
          } else {
            this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL});
          }
        });
  }
  
  
  validate() {
    this.messages = [];
    let noProductFound = true;
    if (!(
        (this.visit && this.visit.id > 0)
        || (this.admission && this.admission.id > 0)
      )) {
      return false;
    }
    
    for (let i in this.bill.billServices) {
      let bs = this.bill.billServices[i];
      if (bs.service && bs.service.id > 0) {
        noProductFound = false;
        if (bs.quantity == null || bs.quantity <= 0)
          this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:'Quantity is required and must be greater than 0.'});
        if (bs.unitAmount == null || bs.unitAmount <= 0)
          this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:'Price is required and must be greater than 0.'});
        
      }
    }
    
    if (noProductFound) {
      this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: 'At least 1 service is required.'});
    }
    
    return this.messages.length === 0;
  }
  
  save() {
    this.messages = [];
    this.bill.admission = this.admission;
    this.bill.visit = this.visit;
    try {
      this.billingService.saveBill(this.bill)
        .subscribe(result => {
          if (result.id > 0) {
            this.bill = result;
            this.messages.push({severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL});
            this.addEmptyRows();
          } else {
            this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL});
          }
        });
    } catch (e) {
      console.log(e);
    }
  }
  
  lookUpVisit(event) {
    this.visit = event;
  }
  
  lookUpAdmission(event) {
    this.admission = event;
  }
  
  lookUpBill(event) {
	this.bill = event;
    this.bill.billDate = new Date(this.bill.billDate);
    this.bill.dueDate = new Date(this.bill.dueDate);
    this.addEmptyRows();
  }
  
  printBill() {
    this.reportView.reportName = 'bill';
    const parameter: Parameter = new Parameter();
    parameter.name = 'BILL_ID_PARAM';
    parameter.dataType = 'Long';
    parameter.value = this.bill.id + '';
    
    this.reportView.parameters = [];
    this.reportView.parameters.push(parameter);
    
    this.reportService.runReport(this.reportView)
      .subscribe(result => {
        if (result.reportName) {
          this.reportName = result.reportName;
          this.messages.push({severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL});
        } else {
          this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL});
        }
      });
  }

 }
