import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Package, Service, PackageService } from '../../models';
import { ServiceDropdown } from '../dropdowns';
import { ConfirmationService } from 'primeng';
import { GenericService, BillingService, TokenStorage, AppInfoStorage } from '../../services';
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
  
  messages: Message[] = [];
  
  constructor
    (
      public genericService: GenericService,
      private billingService: BillingService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      public appInfoStorage: AppInfoStorage,
      public serviceDropdown: ServiceDropdown,
      private route: ActivatedRoute
    ) {
		super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
     this.serviceCols = [
            { field: 'service', header: 'Name', headerKey: 'COMMON.NAME', type: 'string',
                                        style: {width: '20%', 'text-align': 'center'} },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'string',
                                        style: {width: '30%', 'text-align': 'center'} },
            { field: 'quantity', header: 'Quantity', headerKey: 'COMMON.QUANTITY', type: 'string', 
                                        style: {width: '20%', 'text-align': 'center'} },
            { field: 'rate', header: 'Rate', headerKey: 'COMMON.RATE', type: 'string', isDisabled: 'true',
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


  calculateRate() {
    this.pckage.rate = +this.getNumber(this.pckage.grandTotal) - +this.getNumber(this.pckage.discount);
  }
  
  calculateGrandTotal() {
    this.pckage.grandTotal = 0;
    for (const i in this.pckage.packageServices) {
       this.pckage.grandTotal += this.calculateRowTotal(this.pckage.packageServices[i]);
    }
    
    this.calculateRate();
  }

  calculateRowTotal(rowData) {
    rowData.total = (+this.getNumber(rowData.quantity) * +this.getNumber(rowData.rate));
    return rowData.total;
    
  }
  
  populateServiceData(rowData: PackageService) {
    rowData.description = rowData.service.description;
    rowData.quantity = rowData.service.quantity;
    rowData.rate = rowData.service.rate;
  }

  
  private getNumber(value: number): number {
    return value !== undefined ? value : 0;
  } 


}
