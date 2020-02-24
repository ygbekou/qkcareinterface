import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { Admission } from '../../models/admission';
import { Payment } from '../../models/payment';
import { Cookie } from 'ng2-cookies/ng2-cookies'; 
import { GenericService, AppointmentService } from '../../services';

@Component({
  selector: 'app-payment-list',
  templateUrl: '../../pages/admin/paymentList.html',
  providers: [GenericService]
})
export class PaymentList implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  payments: Payment[] = [];
  cols: any[];
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  
  constructor
    (
    private appointmentService: AppointmentService,
    private genericService: GenericService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    ) {

    
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'accountName', header: 'Account' },
            { field: 'amount', header: 'Amount' },
            { field: 'payTo', header: 'Pay To' },
            { field: 'description', header: 'Description' },
            { field: 'status', header: 'Status' }
        ];
    
    this.genericService.getAll('Payment')
      .subscribe((data: Payment[]) => { 
        this.payments = data; 
      },
      error => console.log(error),
      () => console.log('Get all Payments complete'));
  }
 
  
  ngOnDestroy() {
    this.payments = null;
  }
  
  edit(paymentId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'paymentId': paymentId,
        }
      };
      this.router.navigate(['/admin/paymentDetails'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

  delete(paymentId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'paymentId': paymentId,
        }
      };
      this.router.navigate(['/admin/paymentDetails'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

  
 
 }
