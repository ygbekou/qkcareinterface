import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Service, User } from '../../models';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { GenericService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-service-list',
  templateUrl: '../../pages/admin/serviceList.html',
  providers: [GenericService]
})
export class ServiceList implements OnInit, OnDestroy {
 
  services: Service[] = [];
  cols: any[];
  
  constructor
    (
    private genericService: GenericService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    ) {

    
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME' },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION' },
            { field: 'quantity', header: 'Quantity', headerKey: 'COMMON.QUANTITY' },
            { field: 'rate', header: 'Rate', headerKey: 'COMMON.RATE' },
            { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS' }
        ];
    
    this.genericService.getAll('Service')
      .subscribe((data: Service[]) => 
      { 
        this.services = data 
      },
      error => console.log(error),
      () => console.log('Get all Services complete'));
    
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
    this.services = null;
  }
  
  edit(serviceId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "serviceId": serviceId,
        }
      }
      this.router.navigate(["/admin/serviceDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

  delete(serviceId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "serviceId": serviceId,
        }
      }
      this.router.navigate(["/admin/serviceDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

 }
