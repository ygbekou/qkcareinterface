import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Appointment, Admission, Bill, BillPayment, BillService, Employee, Patient, User, Visit, Service, ReportView, Parameter  } from '../../models';
import { EditorModule } from 'primeng/editor';
import { DoctorDropdown, ServiceDropdown } from '../dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { InputTextareaModule, CheckboxModule, MultiSelectModule, CalendarModule } from 'primeng/primeng';
import { GenericService, BillingService, ReportService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message } from 'primeng/api';

@Component({ 
  selector: 'app-bill-details',
  templateUrl: '../../pages/admin/billDetails.html',
  providers: [GenericService, BillingService, ReportService, ServiceDropdown, DoctorDropdown]
})
export class BillDetails implements OnInit, OnDestroy {
  
  messages: Message[] = [];
  bill: Bill = new Bill();
  serviceCols: any[];
  billPaymentCols: any[];
  
  patient: Patient = new Patient();
  
  @Input() visit: Visit;
  @Input() admission: Admission;
  
  itemNumber: string;
  itemNumberLabel: string = 'Visit';
  reportView: ReportView = new ReportView();
  reportName: string;
  
  constructor
    (
      private genericService: GenericService,
      private billingService: BillingService,
      private reportService: ReportService,
      private translate: TranslateService,
      private serviceDropdown: ServiceDropdown,
      private doctorDropdown: DoctorDropdown,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {
    this.patient.user = new User();
  }

  ngOnInit(): void {

     this.serviceCols = [
            { field: 'serviceDate', header: 'Date', headerKey: 'COMMON.DATE', type: 'date' },
            { field: 'service', header: 'Name', headerKey: 'COMMON.NAME' },
            //{ field: 'doctor', header: 'Doctor', headerKey: 'COMMON.DOCTOR' },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION' },
            { field: 'quantity', header: 'Quantity', headerKey: 'COMMON.QUANTITY' },
            { field: 'unitAmount', header: 'Price', headerKey: 'COMMON.PRICE' },
            { field: 'totalAmount', header: 'Total', headerKey: 'COMMON.TOTAL' },
            { field: 'discountAmount', header: 'Discount', headerKey: 'COMMON.DISCOUNT' },
            { field: 'discountPercentage', header: 'Discount' + '%', headerKey: 'COMMON.DISCOUNT_PERCENTAGE' },
            { field: 'netAmount', header: 'Price', headerKey: 'COMMON.NET_AMOUNT' },
            { field: 'payerAmount', header: 'Payer Amount', headerKey: 'COMMON.PAYER_AMOUNT' },
            { field: 'patientAmount', header: 'Patient Amount', headerKey: 'COMMON.PATIENT_AMOUNT' }
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
                  
                  if (this.visit != null)
                    this.itemNumberLabel = 'Visit';
                  else if (this.admission != null)
                    this.itemNumberLabel = 'Admission';
                }
                
              })
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
    this.bill = null;
  }
  
  addEmptyRows() {
    if (this.bill.billServices == null || this.bill.billServices.length == 0) 
      this.addRow();
    if (this.bill.billPayments == null || this.bill.billPayments.length == 0) 
      this.addPaymentRow();
  }
  
  addRow() {
    if (this.bill.billServices == null) {
      this.bill.billServices = [];
    }
    let bs =  new BillService();
    bs.service = new Service();
    bs.doctor = new Employee();
    this.bill.billServices.push(bs);
  }
  
  addPaymentRow() {
    if (this.bill.billPayments == null) {
      this.bill.billPayments = [];
    }
    let bp =  new BillPayment();
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
    for (let i in this.bill.billServices) {
       this.bill.subTotal += this.calculateRowTotal(this.bill.billServices[i]);
    }
    
    this.calculateGrandTotal();
    this.calculateDue();
  }
  
  calculateRowTotal(rowData) {
    rowData.totalAmount = (+this.getNumber(rowData.quantity) * +this.getNumber(rowData.unitAmount));
    rowData.netAmount = ( rowData.totalAmount - +this.getNumber(rowData.discountAmount));
    rowData.patientAmount = rowData.netAmount - +this.getNumber(rowData.payerAmount);
    return rowData.netAmount;
    
  }
  
  private getNumber(value: number): number {
    return value != undefined ? value : 0;
  } 
  
  savePayment(rowData) {
    this.messages = [];
    rowData.data.bill = new Bill()
    rowData.data.bill.id = this.bill.id;
    
    this.genericService.saveWithUrl('/service/billing/payment/save', rowData.data)
        .subscribe(result => {
          if (result.errors == null || result.errors.length == 0) {
            this.bill = result;
            this.messages.push({severity:Constants.SUCCESS, summary:Constants.SAVE_LABEL, detail:Constants.SAVE_SUCCESSFUL});
          }
          else {
            this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:Constants.SAVE_UNSUCCESSFUL});
          }
        })
  }
  
  
  validate() {
    this.messages = [];
    let noProductFound: boolean = true;
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
      this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:'At least 1 service is required.'});
    }
    
    return this.messages.length == 0;
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
            this.messages.push({severity:Constants.SUCCESS, summary:Constants.SAVE_LABEL, detail:Constants.SAVE_SUCCESSFUL});
            this.addEmptyRows();
          }
          else {
            this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:Constants.SAVE_UNSUCCESSFUL});
          }
        })
    }
    catch (e) {
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
    let parameter: Parameter = new Parameter();
    parameter.name = 'BILL_ID_PARAM';
    parameter.dataType = 'Long';
    parameter.value = this.bill.id + '';
    
    this.reportView.parameters = [];
    this.reportView.parameters.push(parameter);
    
    this.reportService.runReport(this.reportView)
      .subscribe(result => {
        if (result.reportName) {
          this.reportName = result.reportName;
          this.messages.push({severity:Constants.SUCCESS, summary:Constants.SAVE_LABEL, detail:Constants.SAVE_SUCCESSFUL});
        }
        else {
          this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:Constants.SAVE_UNSUCCESSFUL});
        }
      })
  }
  
  delete() {
    
  }

 }
