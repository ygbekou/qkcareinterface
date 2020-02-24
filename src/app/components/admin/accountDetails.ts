import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Account } from '../../models/account';
import { Constants } from '../../app.constants';
import { GenericService } from '../../services';

@Component({
  selector: 'app-account-details',
  templateUrl: '../../pages/admin/accountDetails.html',
  providers: []
})
export class AccountDetails implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  account: Account = new Account();
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  
  constructor
    (
      private genericService: GenericService,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {
      
  }

  ngOnInit(): void {
    let accountId = null;
    this.route
        .queryParams
        .subscribe(params => {
          accountId = params['accountId'];
          
          if (accountId != null) {
              this.genericService.getOne(accountId, 'Account')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.account = result;
                } else {
                  this.error = Constants.SAVE_UNSUCCESSFUL;
                  this.displayDialog = true;
                }
              });
          }
        });
    
  }
  
  ngOnDestroy() {
    this.account = null;
  }

  save() {
    try {
      this.error = '';
      this.genericService.save(this.account, 'Account')
        .subscribe(result => {
          if (result.id > 0) {
            this.account = result;
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
