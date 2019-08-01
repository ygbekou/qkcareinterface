import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Package, Service, PackageService, User } from '../../models';
import { EditorModule } from 'primeng/editor';
import { ServiceDropdown } from '../dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { InputTextareaModule, CheckboxModule, MultiSelectModule, CalendarModule, ConfirmationService } from 'primeng/primeng';
import { GenericService, BillingService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message } from 'primeng/api';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-package-details',
  templateUrl: '../../pages/admin/packageDetails.html',
  providers: [GenericService, BillingService, ServiceDropdown]
})
export class PackageDetails extends BaseComponent implements OnInit, OnDestroy {
  
  pckage: Package = new Package();
  serviceCols: any[];
  
  serviceDropdown: ServiceDropdown;
  messages: Message[] = [];
  
  constructor
    (
      public genericService: GenericService,
      private billingService: BillingService,
	  public translate: TranslateService,
	  public confirmationService: ConfirmationService,
      private srvDropdown: ServiceDropdown,
      private route: ActivatedRoute
    ) {
		super(genericService, translate, confirmationService);
    	this.serviceDropdown = srvDropdown;
  }

  ngOnInit(): void {

     this.serviceCols = [
            { field: 'service', header: 'Name', headerKey: 'COMMON.NAME', type: 'string',
                                        style: {width: '20%', 'text-align': 'center'} },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'string',
                                        style: {width: '30%', 'text-align': 'center'} },
            { field: 'quantity', header: 'Quantity', headerKey: 'COMMON.QUANTITY', type: 'string',
                                        style: {width: '20%', 'text-align': 'center'} },
            { field: 'rate', header: 'Rate', headerKey: 'COMMON.RATE', type: 'string',
                                        style: {width: '20%', 'text-align': 'center'} }
        ];
     
    let packageId = null;
    this.route
        .queryParams
        .subscribe(params => {
          
          packageId = params['packageId'];
          
          if (packageId != null) {
              this.billingService.getPackage(packageId)
                  .subscribe(result => {
                if (result.id > 0) {
                  this.pckage = result;
                  if (this.pckage.packageServices === null || this.pckage.packageServices.length === 0 ){
                    this.pckage.packageServices = [];
                    this.addRow();
                  }
                }
              })
          } else {
            this.addRow();
          }
     });
    
  this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }
 
  
  updateCols() {
    for (var index in this.serviceCols) {
      let col = this.serviceCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
  
  ngOnDestroy() {
    this.pckage = null;
  }
  
  clear() {
    this.pckage = new Package();
    this.addRow();
  }
  
  addRow() {
    let ps =  new PackageService();
    ps.service = new Service();
    this.pckage.packageServices.push(ps);
  }
  
  save() {
    
	this.messages = [];
	if (!this.validate()) {
      return;
    }
    try {
      this.billingService.savePackage(this.pckage)
        .subscribe(result => {
          if (result.id > 0) {
				this.processResult(result, this.pckage, this.messages, null);
				this.pckage = result;
			} else {
				this.processResult(result, this.pckage, this.messages, null);
			}
        })
    }
    catch (e) {
      console.log(e);
    }
  }
  

  validate() {
    let noMedFound = true;
      for (const i in this.pckage.packageServices) {
      const ps = this.pckage.packageServices[i];
      if (ps.service.id > 0) {
        noMedFound = false;
        if (ps.quantity === null) {
          this.translate.get(['COMMON.SAVE', 'COMMON.QUANTITY', 'VALIDATION.IS_REQUIRED']).subscribe(res => {
            this.messages.push({
                severity: Constants.ERROR, summary: res['COMMON.SAVE'],
                detail: res['COMMON.QUANTITY'] + ' ' + res['VALIDATION.IS_REQUIRED']
            });
        });
        }
        
        if (ps.rate === null) {
          this.translate.get(['COMMON.SAVE', 'COMMON.RATE', 'VALIDATION.IS_REQUIRED']).subscribe(res => {
            this.messages.push({
                severity: Constants.ERROR, summary: res['COMMON.SAVE'],
                detail: res['COMMON.RATE'] + ' ' + res['VALIDATION.IS_REQUIRED']
            });
           });
        }
      }
    }

    if (noMedFound) {
      this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: 'At least 1 service is required.'});
    }

    return this.messages.length === 0;
  }

}
