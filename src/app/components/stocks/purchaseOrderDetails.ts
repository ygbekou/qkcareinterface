import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Product } from '../../models';
import { PurchaseOrder, PurchaseOrderProduct } from '../../models/stocks/purchaseOrder';
import { EmployeeDropdown, SupplierDropdown, ProductDropdown } from '../dropdowns';
import { ConfirmationService } from 'primeng/primeng';
import { GenericService, PurchasingService, TokenStorage, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message } from 'primeng/api';
import { BaseComponent } from '../admin/baseComponent';
import { ReceiveOrder } from 'src/app/models/stocks/receiveOrder';

@Component({  
  selector: 'app-purchaseOrder-details',
  templateUrl: '../../pages/stocks/purchaseOrderDetails.html',
  providers: [GenericService, PurchasingService, EmployeeDropdown, SupplierDropdown, ProductDropdown]
})
export class PurchaseOrderDetails extends BaseComponent implements OnInit, OnDestroy {
  
  messages: Message[] = [];
  purchaseOrder: PurchaseOrder = new PurchaseOrder();
  receiveOrders: ReceiveOrder[] = [];
  orderProductCols: any[];
  displayRecievingBox: false;
  
  constructor
    (
      public genericService: GenericService,
      private purchaseOrderService: PurchasingService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public globalEventsManager: GlobalEventsManager,
      public tokenStorage: TokenStorage,
      public supplierDropdown: SupplierDropdown,
      public productDropdown: ProductDropdown,
      public employeeDropdown: EmployeeDropdown,
      private route: ActivatedRoute
    ) {
		  super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {

     this.orderProductCols = [
			{ field: 'product', header: 'Name', headerKey: 'COMMON.NAME', type: 'string', style: {width: '20%', 'text-align': 'center'} },
			//{ field: 'productDescription', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'string', style: {width: '20%', 'text-align': 'center'} },
			{ field: 'quantity', header: 'Quantity', headerKey: 'COMMON.QUANTITY', type: 'amount', style: {width: '15%', 'text-align': 'center'}},
			{ field: 'unitPrice', header: 'Price', headerKey: 'COMMON.PRICE', type: 'amount', style: {width: '10%', 'text-align': 'center'}},
      { field: 'totalAmount', header: 'Total', headerKey: 'COMMON.TOTAL', type: 'amount', style: {width: '10%', 'text-align': 'center'}},
      
			
    ]; 
    
    let purchaseOrderId = null;
    this.route
        .queryParams
        .subscribe(params => {          
          
          purchaseOrderId = params['purchaseOrderId'];
          
          this.reload(purchaseOrderId);
     });
   
    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }
 
  
  updateCols() {
    for (let index in this.orderProductCols) {
      const col = this.orderProductCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
  
  ngOnDestroy() {
    this.purchaseOrder = null;
  }

  reload(purchaseOrderId: number) {
     if (purchaseOrderId != null) {
          this.purchaseOrderService.getPurchaseOrder(purchaseOrderId)
              .subscribe(result => {
            if (result.id > 0) {
              this.purchaseOrder = result;
              if (this.purchaseOrder.purchaseOrderProducts.length === 0) { 
                this.addRow();
              }
            }
          });
      } else {
          
      }
  }
  
  addRow() {
    const pop =  new PurchaseOrderProduct();
    pop.product = new Product();
    this.purchaseOrder.purchaseOrderProducts.push(pop);
  }
  
  deleteRow(rowIndex: number) {
    const pop = this.purchaseOrder.purchaseOrderProducts[rowIndex];

    if (pop.id !== null && pop.id !== undefined) {
      pop.status = 9;
      //this.calculateGrandTotal();
      this.save();
    } else {
      this.purchaseOrder.purchaseOrderProducts.splice(rowIndex, 1);
    }
  }

  calculateGrandTotal() {
		this.calculateTotal();
		this.purchaseOrder.grandTotal = +this.getNumber(this.purchaseOrder.subTotal) 
						+ +this.getNumber(this.purchaseOrder.taxes)
						- +this.getNumber(this.purchaseOrder.discount);
						
		
		this.purchaseOrder.taxes = +this.getNumber(this.purchaseOrder.taxes);
		this.purchaseOrder.discount = +this.getNumber(this.purchaseOrder.discount);
    this.purchaseOrder.paid = +this.getNumber(this.purchaseOrder.paid);
    this.purchaseOrder.due = this.purchaseOrder.grandTotal - +this.getNumber(this.purchaseOrder.paid);
    
  }
  
  calculateDue() {
	  this.purchaseOrder.due = +this.purchaseOrder.grandTotal - +this.getNumber(this.purchaseOrder.paid);
  }
  
  calculateTotal() {
    this.purchaseOrder.subTotal = 0;
    for (const i in this.purchaseOrder.purchaseOrderProducts) {
      if (this.purchaseOrder.purchaseOrderProducts[i].status !== 9) {
        this.purchaseOrder.subTotal += this.calculateRowTotal(this.purchaseOrder.purchaseOrderProducts[i]);
        this.purchaseOrder.discount += +this.getNumber(this.purchaseOrder.purchaseOrderProducts[i].discountAmount);
      }
	  }
  }
  
  calculateRowTotal(rowData) {
    rowData.totalAmount = (+this.getNumber(rowData.quantity) * +this.getNumber(rowData.unitPrice) - +this.getNumber(rowData.discount));
    return rowData.totalAmount;
    
  }

  
  private getNumber(value: number): number {
    return value !== undefined ? value : 0;
  } 
  
  validate() {
    let noProductFound = true;
    
    for (const i in this.purchaseOrder.purchaseOrderProducts) {
      const pop = this.purchaseOrder.purchaseOrderProducts[i];
      if (pop.product && pop.product.id > 0) {
        noProductFound = false;
        if (pop.quantity == null) {
			this.translate.get(['COMMON.ERROR', 'COMMON.QUANTITY', 'MESSAGE.IS_REQUIRED']).subscribe(res => {
				this.messages.push({
					severity: Constants.ERROR, summary: res['COMMON.SAVE'],
					detail: res['COMMON.QUANTITY'] + ' ' + res['MESSAGE.IS_REQUIRED']
				});
			});
        }
        if (pop.unitPrice == null) {
			this.translate.get(['COMMON.ERROR', 'COMMON.PRICE', 'MESSAGE.IS_REQUIRED']).subscribe(res => {
				this.messages.push({
					severity: Constants.ERROR, summary: res['COMMON.SAVE'],
					detail: res['COMMON.PRICE'] + ' ' + res['MESSAGE.IS_REQUIRED']
				});
			});
        }
        
      }
    }
    
    if (noProductFound) {
      this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: 'At least 1 product is required.'});
    }
    
    return this.messages.length === 0;
  }
  
  save() {
    
    try {
      this.messages = [];
      
      this.messages = [];
       if (!this.validate()) {
        return;
      }
      
      this.purchaseOrderService.savePurchaseOrder(this.purchaseOrder)
        .subscribe(result => {
          if (result.id > 0) {
            this.purchaseOrder = result;
            this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_SUCCESS']).subscribe(res => {
              this.messages.push({
                severity: Constants.SUCCESS, summary: res['COMMON.SAVE'],
                detail: res['MESSAGE.SAVE_SUCCESS']
              });
            });
          } else {
            this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_UNSUCCESS']).subscribe(res => {
            this.messages.push({
                    severity: Constants.ERROR, summary: res['COMMON.SAVE'],
                    detail: res['MESSAGE.SAVE_UNSUCCESS'] + result
                });
            });
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  updateOrderStatus(purchaseOrderStatusId: number) {
    try {
      this.messages = [];
      const oldOrderStatusId = this.purchaseOrder.purchaseOrderStatus.id;
      this.purchaseOrder.purchaseOrderStatus.id = purchaseOrderStatusId;
      const pops = this.purchaseOrder.purchaseOrderProducts;
      
      this.genericService.save(this.purchaseOrder, 'com.qkcare.model.stocks.PurchaseOrder')
        .subscribe(result => {
          if (result.id > 0) {
            this.purchaseOrder = result;
            this.purchaseOrder.purchaseOrderProducts = pops;
            this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_SUCCESS']).subscribe(res => {
              this.messages.push({
                severity: Constants.SUCCESS, summary: res['COMMON.SAVE'],
                detail: res['MESSAGE.SAVE_SUCCESS']
              });
            });
          } else {
            this.purchaseOrder.purchaseOrderStatus.id = oldOrderStatusId;
            this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_UNSUCCESS']).subscribe(res => {
                this.messages.push({
                    severity: Constants.ERROR, summary: res['COMMON.SAVE'],
                    detail: res['MESSAGE.SAVE_UNSUCCESS'] + result
                });
            });
          }
        });
    } catch (e) {
      console.log(e);
    }
  }


  populateDefaultProductValues(rowData: PurchaseOrderProduct) {
    rowData.unitPrice = rowData.product.price;
  }
  
  delete() {
  
  }
  
  clear() {
	this.purchaseOrder = new PurchaseOrder();
  }
 }
