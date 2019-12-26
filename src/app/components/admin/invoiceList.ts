import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { Invoice } from '../../models/invoice'; 
import { GenericService } from '../../services';

@Component({
  selector: 'app-invoice-list',
  templateUrl: '../../pages/admin/invoiceList.html',
  providers: [GenericService]
})
export class InvoiceList implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  invoices: Invoice[] = [];
  cols: any[];
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  
  constructor
    (
    private genericService: GenericService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    ) {

    
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'invoiceDate', header: 'Date' },
            { field: 'patientId', header: 'Patient ID' },
            { field: 'patientName', header: 'Patient Name' },
            { field: 'subTotal', header: 'Sub Total' },
            { field: 'taxes', header: 'Taxes' },
            { field: 'discount', header: 'Discount' },
            { field: 'grandTotal', header: 'Grand Total' },
            { field: 'paid', header: 'Paid' },
            { field: 'due', header: 'Due' },
            { field: 'status', header: 'Status', type:'string' }
        ];
    
    this.route
        .queryParams
        .subscribe(params => {          
          
            let parameters: string [] = []; 
            
            parameters.push('e.status = |status|0|Integer')
            
            this.genericService.getAllByCriteria('Invoice', parameters)
              .subscribe((data: Invoice[]) => 
              { 
                this.invoices = data 
              },
              error => console.log(error),
              () => console.log('Get all Invoices complete'));
          });
  }
 
  
  ngOnDestroy() {
    this.invoices = null;
  }
  
  edit(invoiceId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "invoiceId": invoiceId,
        }
      }
      this.router.navigate(["/admin/invoiceDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

  delete(invoiceId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "invoiceId": invoiceId,
        }
      }
      this.router.navigate(["/admin/invoiceDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

 }
