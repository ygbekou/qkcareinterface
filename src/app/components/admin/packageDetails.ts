import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Package, Service, PackageService, User } from '../../models';
import { EditorModule } from 'primeng/editor';
import { ServiceDropdown } from '../dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { InputTextareaModule, CheckboxModule, MultiSelectModule, CalendarModule } from 'primeng/primeng';
import { GenericService, BillingService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-package-details',
  templateUrl: '../../pages/admin/packageDetails.html',
  providers: [GenericService, BillingService, ServiceDropdown]
})
export class PackageDetails implements OnInit, OnDestroy {
  
  pckage: Package = new Package();
  serviceCols: any[];
  
  serviceDropdown: ServiceDropdown;
  messages: Message[] = [];
  
  constructor
    (
      private genericService: GenericService,
      private billingService: BillingService,
      private translate: TranslateService,
      private srvDropdown: ServiceDropdown,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {
    this.serviceDropdown = srvDropdown;
    
  }

  ngOnInit(): void {

     this.serviceCols = [
            { field: 'service', header: 'Name', headerKey: 'COMMON.NAME' },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION' },
            { field: 'quantity', header: 'Quantity', headerKey: 'COMMON.QUANTITY' },
            { field: 'rate', header: 'Rate', headerKey: 'COMMON.RATE' }
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
                  if (this.pckage.packageServices == null || this.pckage.packageServices.length == 0 ){
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
    try {
      this.billingService.savePackage(this.pckage)
        .subscribe(result => {
          if (result.id > 0) {
            this.pckage = result;
            this.messages.push({severity:Constants.SUCCESS, summary:Constants.SAVE_LABEL, detail:Constants.SAVE_SUCCESSFUL});
          }
          else {
            this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:Constants.SAVE_UNSUCCESSFUL});
          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }
  
  delete() {
    
  }
}
