import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../app.constants';
import { Appointment, Admission, Bill, BillPayment, BillService, Employee, Patient, User, Visit, Service  } from '../models';
import { EditorModule } from 'primeng/editor';
import { DoctorDropdown, ServiceDropdown } from './dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { InputTextareaModule, CheckboxModule, MultiSelectModule, CalendarModule } from 'primeng/primeng';

import { GenericService, BillingService } from '../services';
import { Message } from 'primeng/api';

@Component({ 
  selector: 'app-bill-details',
  templateUrl: '../pages/billDetails.html',
  providers: [GenericService, BillingService, ServiceDropdown, DoctorDropdown]
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
  
  constructor
    (
      private genericService: GenericService,
      private billingService: BillingService,
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
            { field: 'service', header: 'Name' },
            { field: 'doctor', header: 'Doctor' },
            { field: 'quantity', header: 'Quantity' },
            { field: 'unitAmount', header: 'Price' },
            { field: 'discountAmount', header: 'Discount' },
            { field: 'payerAmount', header: 'Payer Amount' },
            { field: 'patientAmount', header: 'Patient Amount' }
        ]; 
    
      this.billPaymentCols = [
            { field: 'description', header: 'Description' },
            { field: 'amount', header: 'Amount' }
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
                  if (this.bill.billServices.length == 0) 
                    this.addRow();
                  if (this.bill.billPayments.length == 0) 
                    this.addPaymentRow();
                }
                
              })
          } else {
              
          }
     });
    
  }
  
  ngOnDestroy() {
    this.bill = null;
  }
  
  addRow() {
    let bs =  new BillService();
    bs.service = new Service();
    bs.doctor = new Employee();
    this.bill.billServices.push(bs);
  }
  
  addPaymentRow() {
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
  }
  
  calculateRowTotal(rowData) {
    rowData.totalAmount = (+this.getNumber(rowData.quantity) * +this.getNumber(rowData.unitAmount));
    rowData.patientAmount = rowData.totalAmount - +this.getNumber(rowData.discountAmount) - +this.getNumber(rowData.payerAmount);
    return rowData.totalAmount;
    
  }
  
  private getNumber(value: number): number {
    return value != undefined ? value : 0;
  } 
  
  savePayment(rowData) {
    this.messages = [];
    rowData.data.bill = new Bill()
    rowData.data.bill.id = this.bill.id;
    this.genericService.save(rowData.data, 'BillPayment')
        .subscribe(result => {
          alert(result.id)
          if (result.id > 0) {
            rowData.data = result
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

 }
