import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Patient } from '../../models/patient';
import { Invoice } from '../../models/invoice';
import { Account } from '../../models/account';
import { InvoiceAccount } from '../../models/invoiceAccount';
import { AccountDropdown } from '../dropdowns';
import { User } from '../../models/user';  
import { GenericService, AccountService } from '../../services';

@Component({
  selector: 'app-invoice-details',
  templateUrl: '../../pages/admin/invoiceDetails.html',
  providers: [GenericService, AccountService, AccountDropdown]
})
export class InvoiceDetails implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  invoice: Invoice = new Invoice();
  accountCols: any[];
  
  accountDropdown: AccountDropdown;
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  SELECT_OPTION: string = Constants.SELECT_OPTION;
  
  constructor
    (
      private genericService: GenericService,
      private accountService: AccountService,
      private acctDropdown: AccountDropdown,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {
    this.accountDropdown = acctDropdown;
    
  }

  ngOnInit(): void {

     this.accountCols = [
            { field: 'account', header: 'Name' },
            { field: 'description', header: 'Description' },
            { field: 'quantity', header: 'Quantity' },
            { field: 'unitPrice', header: 'Price' },
            { field: 'total', header: 'Sub', isDisabled: 'True' }
        ];
    
    let invoiceId = null;
    this.route
        .queryParams
        .subscribe(params => {          
          
          this.invoice.patient = new Patient();
          this.invoice.patient.user = new User();
          this.addRow();
          
          invoiceId = params['invoiceId'];
          
          if (invoiceId != null) {
              this.genericService.getOne(invoiceId, 'Invoice')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.invoice = result;
                } else {
                  this.error = Constants.SAVE_UNSUCCESSFUL;
                  this.displayDialog = true;
                }
              });
          } else {
              
          }
     });
    
  }
  
  ngOnDestroy() {
    this.invoice = null;
  }
  
  addRow() {
    const ia =  new InvoiceAccount();
    ia.account = new Account();
    this.invoice.invoiceAccounts.push(ia);
  }
  
  calculateGrandTotal() {
    this.invoice.grandTotal = +this.getNumber(this.invoice.subTotal) + +this.getNumber(this.invoice.taxes)
                    - +this.getNumber(this.invoice.discount);
  }
  
  calculateDue() {
    this.invoice.due = +this.invoice.grandTotal - +this.getNumber(this.invoice.paid);
  }
  
  calculateTotal() {
    this.invoice.subTotal = 0;
    // tslint:disable-next-line: forin
    for (const i in this.invoice.invoiceAccounts) {
       this.invoice.subTotal += this.calculateRowTotal(this.invoice.invoiceAccounts[i]);
    }
  }
  
  calculateRowTotal(rowData) {
    rowData.total = +this.getNumber(rowData.quantity) * +this.getNumber(rowData.unitPrice);
    return rowData.total;
    
  }
  
  private getNumber(value: number): number {
    return value !== undefined ? value : 0;
  } 
  
  
  save() {
    
    try {
      this.error = '';
      this.accountService.saveInvoice(this.invoice)
        .subscribe(result => {
          if (result.id > 0) {
            this.invoice = result;
            console.info(this.invoice);
          } else {
            this.error = Constants.SAVE_UNSUCCESSFUL;
            this.displayDialog = true;
          }
        });
    } catch (e) {
      console.log(e);
    }
  }
  
  lookUpPatient() {
    
    const parameters: string [] = []; 
            
    parameters.push('e.matricule = |matricule|' + this.invoice.patient.medicalRecordNumber + '|String');
    
    this.genericService.getAllByCriteria('Patient', parameters)
      .subscribe((data: Patient[]) => { 
        if (data.length > 0) {
          this.invoice.patient = data[0];
        }
      },
      error => console.log(error),
      () => console.log('Get Patient complete'));
  }
  
  delete() {
    
  }

 }
