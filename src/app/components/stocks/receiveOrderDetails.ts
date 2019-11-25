import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { PurchaseOrder } from '../../models/stocks/purchaseOrder';
import { ReceiveOrder } from '../../models/stocks/receiveOrder';
import { EmployeeDropdown, SupplierDropdown, ProductDropdown } from '../dropdowns';
import { GenericService, PurchasingService, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from '../admin/baseComponent';
 
@Component({  
  selector: 'app-receiveOrder-details',
  templateUrl: '../../pages/stocks/receiveOrderDetails.html',
  providers: [GenericService, PurchasingService, EmployeeDropdown, SupplierDropdown, ProductDropdown]
})
export class ReceiveOrderDetails extends BaseComponent implements OnInit, OnDestroy {
  
  receiveOrders: ReceiveOrder[] = [];
  receiveOrder: ReceiveOrder = new ReceiveOrder();
  orderProductCols: any[];
  messages: Message[] = [];
  supplierDropdown: SupplierDropdown;
  productDropdown: ProductDropdown;
  
  
  constructor
  (
      public genericService: GenericService,
      private purchasingService: PurchasingService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      public splDropdown: SupplierDropdown,
      public pdtDropdown: ProductDropdown,
      public employeeDropdown: EmployeeDropdown,
      private route: ActivatedRoute
  ) {
		  super(genericService, translate, confirmationService, tokenStorage);
    	this.supplierDropdown = splDropdown;
    	this.productDropdown = pdtDropdown;	
  }


  ngOnInit(): void {

     this.orderProductCols = [
            { field: 'productName', header: 'Name', headerKey: 'COMMON.NAME' },
            { field: 'productDescription', header: 'Description', headerKey: 'COMMON.DESCRIPTION' },
            { field: 'originalQuantity', header: 'Quantity Ordered', headerKey: 'COMMON.QUANTITY_ORDERED', type: 'amount'},
            { field: 'quantity', header: 'Quantity Received', headerKey: 'COMMON.QUANTITY_RECEIVED', type: 'amount'},
            { field: 'notes', header: 'Notes', headerKey: 'COMMON.NOTES'}
        ]; 
    
    let receiveOrderId = null;
    this.route
        .queryParams
        .subscribe(params => {          
          
          receiveOrderId = params['receiveOrderId'];
          
          if (receiveOrderId !== undefined && receiveOrderId !== null) {
              this.genericService.getNewObject('/service/purchasing/receiveOrder/', receiveOrderId)
                  .subscribe(result => {
                if (result.id > 0) {
                  this.receiveOrders = result;
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
    for (let index in this.orderProductCols) {
      const col = this.orderProductCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
  

  ngOnDestroy() {
    this.receiveOrders = null;
  }
 
  
  private getNumber(value: number): number {
    return value !== undefined ? value : 0;
  } 
  

  save(status: number) {
    this.receiveOrders[0].status = status;
    
    try {
      this.messages = [];
      this.purchasingService.saveReceiveOrder(this.receiveOrders[0])
        .subscribe(result => {
          if (result.id > 0) {
            this.receiveOrders[0] = result;
            this.messages.push({severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL});
          } else {
             this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL});
          }
        }); 
    } catch (e) {
      console.log(e);
    }
  }
  
  delete(){
	  
  }

  lookUpPurchaseOrder(event) {
    this.purchaseOrder = event;
    
    if (this.purchaseOrder && this.purchaseOrder.id > 0) {
      this.purchasingService.getNewReceiveOrder(this.purchaseOrder.id)
      .subscribe((data: ReceiveOrder[]) => { 
  
        this.receiveOrders = data;
        console.info(this.receiveOrders);
        
      },
      error => console.log(error),
      () => console.log('Get PurchaseOrder complete'));
    }
  }

 }
