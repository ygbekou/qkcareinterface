import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Bill } from '../../models';
import { GenericService, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-bill-list',
  templateUrl: '../../pages/admin/billList.html',
  providers: [GenericService]
})
export class BillList extends BaseComponent implements OnInit, OnDestroy {
  
  bills: Bill[] = [];
  cols: any[];
  
  constructor
    (
    public genericService: GenericService,
    public translate: TranslateService,
    public tokenStorage: TokenStorage,
    public confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router,
    ) {

    super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'billDate', header: 'Date', headerKey: 'COMMON.DATE', type:'date' },
            { field: 'patientId', header: 'Patient ID', headerKey: 'COMMON.PATIENT_ID' },
            { field: 'patientName', header: 'Patient Name', headerKey: 'COMMON.PATIENT_NAME' },
            { field: 'subTotal', header: 'Sub Total', headerKey: 'COMMON.SUBTOTAL' },
            { field: 'taxes', header: 'Taxes', headerKey: 'COMMON.TAXES' },
            { field: 'discount', header: 'Discount', headerKey: 'COMMON.DISCOUNT' },
            { field: 'grandTotal', header: 'Grand Total', headerKey: 'COMMON.GRANDTOTAL' },
            { field: 'paid', header: 'Paid', headerKey: 'COMMON.AMOUNT_PAID' },
            { field: 'due', header: 'Due', headerKey: 'COMMON.AMOUNT_DUE' },
            { field: 'status', header: 'Status', headerKey: 'COMMON.STATUS', type:'string' }
        ];
    
    this.route
        .queryParams
        .subscribe(params => {          
          
            let parameters: string [] = []; 
            
            parameters.push('e.status = |status|0|Integer')
            
            this.genericService.getAllByCriteria('Bill', parameters)
              .subscribe((data: Bill[]) => 
              { 
                this.bills = data 
              },
              error => console.log(error),
              () => console.log('Get all Bills complete'));
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
    this.bills = null;
  }
  
  edit(billId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "billId": billId,
        }
      }
      this.router.navigate(["/admin/billDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

  delete(billId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "billId": billId,
        }
      }
      this.router.navigate(["/admin/billDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

 }
