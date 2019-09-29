import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { ReceiveOrder, ReceiveOrderProduct } from '../../models/stocks/receiveOrder';
import { SaleReturn } from '../../models/stocks/saleReturn';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { InputTextareaModule, CheckboxModule, ConfirmationService } from 'primeng/primeng';
import { User } from '../../models/user';  
import { GenericService, PurchasingService, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from '../admin/baseComponent';

@Component({
  selector: 'app-saleReturn-list',
  templateUrl: '../../pages/stocks/saleReturnList.html',
  providers: [GenericService, PurchasingService]
})
export class SaleReturnList extends BaseComponent implements OnInit, OnDestroy {
  
  saleReturns: SaleReturn[] = [];
  cols: any[];
  
  constructor
    (
    public genericService: GenericService,
    private purchasingService: PurchasingService,
    public translate: TranslateService,
    public confirmationService: ConfirmationService,
    public tokenStorage: TokenStorage,
    private route: ActivatedRoute,
    private router: Router,
    ) {
      super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'returnDatetime', header: 'Return Date', headerKey: 'COMMON.RETURN_DATETIME', type:'date', format: 'dd/MM/yyyy' },
            { field: 'comments', header: 'Comments', headerKey: 'COMMON.COMMENTS' },
            { field: 'patientSaleId', header: 'PS ID', headerKey: 'COMMON.SALE_ID' },
            { field: 'patientSaleDatetime', header: 'Sale Date', headerKey: 'COMMON.SALE_DATETIME', type: 'date', format: 'dd/MM/yyyy hh:mm'},
            { field: 'status', header: 'Status', headerKey: 'COMMON.STATUS', type:'string' }
        ];
    
    this.route
        .queryParams
        .subscribe(params => {          
          
            let parameters: string [] = []; 
            
            this.genericService.getAllByCriteria('com.qkcare.model.stocks.SaleReturn', parameters)
              .subscribe((data: SaleReturn[]) => 
              { 
                this.saleReturns = data 
              },
              error => console.log(error),
              () => console.log('Get all SaleReturn complete'));
          });
  
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
    this.saleReturns = null;
  }
  
  edit(saleReturnId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "saleReturnId": saleReturnId,
        }
      }
      this.router.navigate(["/admin/saleReturnDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

  delete(saleReturnId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "saleReturnId": saleReturnId,
        }
      }
      this.router.navigate(["/admin/saleReturnrDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

 }
