import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Service } from '../../models/service';
import { Constants } from '../../app.constants';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { User } from '../../models/user';  
import { GenericService } from '../../services';
import { DoctorOrderTypeDropdown } from '../dropdowns';

@Component({
  selector: 'app-service-details',
  templateUrl: '../../pages/admin/serviceDetails.html',
  providers: [GenericService, DoctorOrderTypeDropdown]
})
export class ServiceDetails implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  service: Service = new Service();
  
  doctorOrderTypeDropdown: DoctorOrderTypeDropdown;
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  
  constructor
    (
      private genericService: GenericService,
      docOrderTypeDropdown: DoctorOrderTypeDropdown,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {
      this.doctorOrderTypeDropdown = docOrderTypeDropdown;
  }

  ngOnInit(): void {
    let serviceId = null;
    this.route
        .queryParams
        .subscribe(params => {
          serviceId = params['serviceId'];
          
          if (serviceId != null) {
              this.genericService.getOne(serviceId, 'Service')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.service = result
                }
                else {
                  this.error = Constants.SAVE_UNSUCCESSFUL;
                  this.displayDialog = true;
                }
              })
          }
        });
    
  }
  
  ngOnDestroy() {
    this.service = null;
  }

  save() {
    try {
      this.error = '';
      this.genericService.save(this.service, 'Service')
        .subscribe(result => {
          if (result.id > 0) {
            this.service = result
          }
          else {
            this.error = Constants.SAVE_UNSUCCESSFUL;
            this.displayDialog = true;
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
