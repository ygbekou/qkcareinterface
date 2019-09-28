import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Service } from '../../models/service';
import { GenericService, TokenStorage } from '../../services';
import { DoctorOrderTypeDropdown } from '../dropdowns';
import { BaseComponent } from './baseComponent';
import { Message, ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-service-details',
  templateUrl: '../../pages/admin/serviceDetails.html',
  providers: [GenericService, DoctorOrderTypeDropdown]
})
export class ServiceDetails extends BaseComponent implements OnInit, OnDestroy {
  
  service: Service = new Service();
  doctorOrderTypeDropdown: DoctorOrderTypeDropdown;
  messages: Message[] = [];

  constructor
    (
      public genericService: GenericService,
      private docOrderTypeDropdown: DoctorOrderTypeDropdown,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      private route: ActivatedRoute
    ) {
		    super(genericService, translate, confirmationService, tokenStorage);
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
               })
          }
        });
    
  }
  
  ngOnDestroy() {
    this.service = null;
  }

  save() {
    try {
      this.messages = [];
      this.genericService.save(this.service, 'Service')
        .subscribe(result => {
          if (result.id > 0) {
			this.processResult(result, this.service, this.messages, null);
			this.service = result;
          } else {
            this.processResult(result, this.service, this.messages, null);
          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }

  addNew() {
	this.messages = [];
    this.service = new Service();
  }
  
 }
