import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Product, Supplier, User } from '../../models';
import { PatientSale } from '../../models/stocks/patientSale';
import { PurchaseOrder, PurchaseOrderProduct } from '../../models/stocks/purchaseOrder';
import { ReceiveOrder } from '../../models/stocks/receiveOrder';
import { SaleReturn } from '../../models/stocks/saleReturn';
import { EditorModule } from 'primeng/editor';
import { EmployeeDropdown, SupplierDropdown, ProductDropdown } from '../dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { InputTextareaModule, CheckboxModule, MultiSelectModule, CalendarModule } from 'primeng/primeng';
import { GenericService, PurchasingService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message } from 'primeng/api';
 
@Component({  
  selector: 'app-saleReturn-details',
  templateUrl: '../../pages/stocks/saleReturnDetails.html',
  providers: [GenericService, PurchasingService, EmployeeDropdown, SupplierDropdown, ProductDropdown]
})
export class SaleReturnDetails implements OnInit, OnDestroy {
  
  saleReturn: SaleReturn = new SaleReturn();
  returnProductCols: any[];
  messages: Message[] = [];
  
  patientSale: PatientSale = new PatientSale();
  
  constructor
    (
      private genericService: GenericService,
      private purchasingService: PurchasingService,
      private translate: TranslateService,
      private productDropdown: ProductDropdown,
      private employeeDropdown: EmployeeDropdown,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {
  }

  ngOnInit(): void {

     this.returnProductCols = [
            { field: 'productName', header: 'Name', headerKey: 'COMMON.NAME' },
            { field: 'unitPrice', header: 'Unit Price', headerKey: 'COMMON.PRICE', type: 'amount', inputType: 'text'},
            { field: 'originalQuantity', header: 'Sale Quantity', headerKey: 'COMMON.QUANTITY_SOLD', type: 'amount'},
            { field: 'quantity', header: 'Returned Quantity', headerKey: 'COMMON.QUANTITY_RETURNED', type: 'number'},
            { field: 'notes', header: 'Notes', headerKey: 'COMMON.NOTES', type: "text"}
        ]; 
    
    let saleReturnId = null;
    this.route
        .queryParams
        .subscribe(params => {          
          
          saleReturnId = params['saleReturnId'];
          
          if (saleReturnId != null) {
              this.genericService.getNewObject('/service/purchasing/saleReturn/', saleReturnId)
                  .subscribe(result => {
                if (result.id > 0) {
                  this.saleReturn = result
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
    for (var index in this.returnProductCols) {
      let col = this.returnProductCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
  
  ngOnDestroy() {
    this.saleReturn = null;
  }
 
  
  private getNumber(value: number): number {
    return value != undefined ? value : 0;
  } 
  
  validate(): boolean {
    this.messages = [];
    let noProductFound = true;
    if (!this.patientSale || !(this.patientSale.id > 0))
      return false;
    
    for (let i in this.saleReturn.saleReturnProducts) {
      let srp = this.saleReturn.saleReturnProducts[i];
      if (srp.product && srp.product.id > 0) {
        noProductFound = false;
        if (srp.quantity == null || srp.quantity <= 0)
          this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:'Quantity is required.'});
      }
    }
    
    
    if (noProductFound) {
      this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:'At least 1 medication is required.'});
    }
    
    return this.messages.length == 0;
  }
  
  save(status: number) {
    this.messages = []
    
    if (!status) {
      this.saleReturn.status = 1
    } else {
      this.saleReturn.status = status;
    }
    
    try {
      
      this.genericService.saveWithUrl('/service/purchasing/saleReturn/save', this.saleReturn)
        .subscribe(result => {
          if (result.id > 0) {
            this.saleReturn = result
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
  
  lookUpPatientSale(event) {
    this.patientSale = event;
    
    this.genericService.getNewObject('/service/purchasing/patientSale/newSaleReturn/', this.patientSale.id)
      .subscribe((data: SaleReturn) => 
      {
        this.saleReturn = data;
      },
      error => console.log(error),
      () => console.log('Get saleReturn complete'));
  }

  calculateGrandTotal() {
    this.saleReturn.grandTotal = +this.getNumber(this.saleReturn.subTotal) + +this.getNumber(this.saleReturn.taxes)
                    - +this.getNumber(this.saleReturn.discount);
  }
  
  
  calculateTotal() {
    this.saleReturn.subTotal = 0;
    for (let i in this.saleReturn.saleReturnProducts) {
       this.saleReturn.subTotal += this.calculateRowTotal(this.saleReturn.saleReturnProducts[i]);
    }
    this.calculateGrandTotal();
  }
  
  calculateRowTotal(rowData) {
    rowData.totalAmount = (+this.getNumber(rowData.quantity) * +this.getNumber(rowData.unitPrice));
    return rowData.totalAmount;
    
  }
 }
