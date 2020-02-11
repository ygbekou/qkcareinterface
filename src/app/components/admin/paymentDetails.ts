import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Payment} from '../../models/payment';
import {Constants} from '../../app.constants';
import {Account} from '../../models/account';
import {AccountDropdown} from '../dropdowns';
import {GenericService} from '../../services';


@Component({
  selector: 'app-payment-details',
  templateUrl: '../../pages/admin/paymentDetails.html',
  providers: [GenericService, AccountDropdown]
})
  
export class PaymentDetails implements OnInit, OnDestroy {

  public error: String = '';
  displayDialog: boolean;
  payment: Payment = new Payment();
  accountDropdown: AccountDropdown;

  uploadedFiles: any[] = [];
  formData = new FormData();
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;
  DEPARTMENT: string = Constants.DEPARTMENT;
  DOCTOR: string = Constants.DOCTOR;
  ROLE: string = Constants.ROLE;

  
  constructor
    (
    private genericService: GenericService,
    private acctDropdown: AccountDropdown,
    private route: ActivatedRoute,
    ) {
    this.accountDropdown = acctDropdown;
  }

  ngOnInit(): void {

    let paymentId = null;
    this.route
      .queryParams
      .subscribe(params => {

        this.payment.account = new Account();
        paymentId = params['paymentId'];

        if (paymentId != null) {
          this.genericService.getOne(paymentId, 'Payment')
            .subscribe(result => {
              if (result.id > 0) {
                this.payment = result;
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
    this.payment = null;
  }
  
  save() {
    try {
      this.error = '';
      this.genericService.save(this.payment, 'Payment')
        .subscribe(result => {
          if (result.id > 0) {
            this.payment = result;
          } else {
            this.error = Constants.SAVE_UNSUCCESSFUL;
            this.displayDialog = true;
          }
        });
    } catch (e) {
      console.log(e);
    }
  }
  
  delete() {
    
  }

}
