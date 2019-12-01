import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { SearchCriteria } from '../../models';
import { PurchaseOrder } from '../../models/stocks/purchaseOrder';
import { EmployeeDropdown, SupplierDropdown, ProductDropdown } from '../dropdowns';
import { ConfirmationService } from 'primeng/primeng';
import { GenericService, PurchasingService, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from '../admin/baseComponent';

@Component({
  selector: 'app-purchaseOrder-list',
  templateUrl: '../../pages/stocks/purchaseOrderList.html',
  providers: [GenericService, PurchasingService, EmployeeDropdown, SupplierDropdown, ProductDropdown]
})
export class PurchaseOrderList extends BaseComponent implements OnInit, OnDestroy {
  
  purchaseOrders: PurchaseOrder[] = [];
  cols: any[];
  
  searchCriteria: SearchCriteria = new SearchCriteria();
  
  constructor
    (
    public genericService: GenericService,
    private purchasingService: PurchasingService,
    public translate: TranslateService,
    public confirmationService: ConfirmationService,
    public tokenStorage: TokenStorage,
    public supplierDropdown: SupplierDropdown,
    public productDropdown: ProductDropdown,
    public employeeDropdown: EmployeeDropdown,
    private router: Router,
    ) {
		super(genericService, translate, confirmationService, tokenStorage);
    
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'purchaseOrderDate', header: 'Date', headerKey: 'COMMON.DATE', 
					type: 'date', style: {width: '10%', 'text-align': 'center'} },
            { field: 'supplierName', header: 'Supplier', headerKey: 'COMMON.SUPPLIER', 
					type: 'string', style: {width: '10%', 'text-align': 'center'} },
            { field: 'requestorName', header: 'Requestor', headerKey: 'COMMON.REQUESTOR', 
					type: 'string', style: {width: '12%', 'text-align': 'center'} },
            { field: 'receiverName', header: 'Receiver', headerKey: 'COMMON.RECEIVER', 
					type: 'string', style: {width: '12%', 'text-align': 'center'} },
            { field: 'subTotal', header: 'Sub Total', headerKey: 'COMMON.SUBTOTAL', 
					type: 'string', style: {width: '10%', 'text-align': 'center'} },
            { field: 'taxes', header: 'Taxes', headerKey: 'COMMON.TAXES', 
					type: 'string', style: {width: '8%', 'text-align': 'center'} },
            { field: 'discount', header: 'Discount', headerKey: 'COMMON.DISCOUNT', 
					type: 'string', style: {width: '8%', 'text-align': 'center'} },
            { field: 'grandTotal', header: 'Grand Total', headerKey: 'COMMON.GRANDTOTAL', 
					type: 'string', style: {width: '8%', 'text-align': 'center'} },
            { field: 'due', header: 'Due', headerKey: 'COMMON.AMOUNT_DUE', 
					type: 'string', style: {width: '8%', 'text-align': 'center'} },
            { field: 'purchaseOrderStatusDesc', header: 'Status', headerKey: 'COMMON.STATUS', 
					type: 'string', style: {width: '6%', 'text-align': 'center'} }
        ];
    
    // this.route
    //     .queryParams
    //     .subscribe(params => {          
          
    //         let parameters: string [] = []; 
            
    //         parameters.push('e.status = |status|0|Integer')
            
    //         this.genericService.getAllByCriteria('com.qkcare.model.stocks.PurchaseOrder', parameters)
    //           .subscribe((data: PurchaseOrder[]) => 
    //           { 
    //             this.purchaseOrders = data 
    //           },
    //           error => console.log(error),
    //           () => console.log('Get all PurchaseOrders complete'));
    //       });
    
    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }
 
  
  updateCols() {
    for (var index in this.cols) {
      let col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
 
  
  ngOnDestroy() {
    this.purchaseOrders = null;
  }
  
  edit(purchaseOrderId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "purchaseOrderId": purchaseOrderId,
        }
      }
      this.router.navigate(["/admin/purchaseOrderDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

  search() {
   
    let parameters: string [] = []; 
        
    if (this.searchCriteria.requestor && this.searchCriteria.requestor.id > 0)  {
      parameters.push('e.requestor.id = |requestorId|' + this.searchCriteria.requestor.id + '|Long');
    }
    if (this.searchCriteria.shipTo && this.searchCriteria.shipTo.id > 0)  {
      parameters.push('e.shipTo.id = |shipToId|' + this.searchCriteria.shipTo.id + '|Long');
    } 
    if (this.searchCriteria.supplier && this.searchCriteria.supplier.id > 0)  {
      parameters.push('e.supplier.id = |supplierId|' + this.searchCriteria.supplier.id + '|Long');
    }  
    if (this.searchCriteria.purchaseOrderDate != null)  {
      parameters.push('e.purchaseOrderDate = |purchaseOrderDate|' + this.searchCriteria.purchaseOrderDate.toLocaleDateString() + '|Date')
    }  
    
    this.genericService.getAllByCriteria('PurchaseOrder', parameters)
      .subscribe((data: PurchaseOrder[]) => 
      { 
        this.purchaseOrders = data 
      },
      error => console.log(error),
      () => console.log('Get all Purchase Orders complete'));
	}
	

	validatePerformSearch(): boolean {
		this.purchaseOrders = [];

		if ((this.searchCriteria.requestor === undefined || this.searchCriteria.requestor === null 
					|| this.searchCriteria.requestor.id  === undefined)
			&& (this.searchCriteria.shipTo === undefined || this.searchCriteria.shipTo === null || this.searchCriteria.shipTo.id === undefined)
			&& (this.searchCriteria.supplier === undefined || this.searchCriteria.supplier === null || this.searchCriteria.supplier.id === undefined)
			&& (this.searchCriteria.purchaseOrderDate === undefined || this.searchCriteria.purchaseOrderDate === null) ) {
			return false;
		}
		return true;

	}
  
 }
