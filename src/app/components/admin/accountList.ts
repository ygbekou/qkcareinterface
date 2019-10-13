import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Account } from '../../models/account';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { User } from '../../models/user';  
import { GenericService } from '../../services';

@Component({
  selector: 'app-account-list',
  templateUrl: '../../pages/admin/accountList.html',
  providers: []
})
export class AccountList implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  accounts: Account[] = [];
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
            { field: 'name', header: 'Name' },
            { field: 'description', header: 'Description' },
            { field: 'accountTypeDesc', header: 'Type' },
            { field: 'statusDesc', header: 'Status' }
        ];
    
    this.genericService.getAll('Account')
      .subscribe((data: Account[]) => 
      { 
        this.accounts = data 
      },
      error => console.log(error),
      () => console.log('Get all Accounts complete'));
  }
 
  
  ngOnDestroy() {
    this.accounts = null;
  }
  
  edit(accountId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "accountId": accountId,
        }
      }
      this.router.navigate(["/admin/accountDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

  delete(accountId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "accountId": accountId,
        }
      }
      this.router.navigate(["/admin/accountDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

 }
