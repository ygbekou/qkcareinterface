import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { ResourceDropdown } from '../dropdowns';
import { GenericService, TokenStorage } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, Message } from 'primeng/api';
import { BaseComponent } from '../admin/baseComponent';
import { Resource } from 'src/app/models';


@Component({
  selector: 'app-resource-details',
  templateUrl: '../../pages/authorization/resourceDetails.html',
  providers: [ ResourceDropdown]
})
export class ResourceDetails extends BaseComponent implements OnInit, OnDestroy {
  
  resource: Resource = new Resource();

  messages: Message[] = [];

  @Output() resourceSaveEvent = new EventEmitter<Resource>();
  
  constructor
    (
      public genericService: GenericService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public resourceDropdown: ResourceDropdown,
      public tokenStorage: TokenStorage
    ) {

		  super(genericService, translate, confirmationService, tokenStorage);

  }

  ngOnInit(): void {

  }
  
  ngOnDestroy() {
    this.resource = null;
  }

  getResource(resourceId: number) {
    this.genericService.getOne(resourceId, 'com.qkcare.model.authorization.Resource')
        .subscribe(result => {
      if (result.id > 0) {
        this.resource = result;
      }
    });
  }
  
  save() {
    try {
	  this.messages = [];
      this.genericService.saveWithUrl('/service/com.qkcare.model.authorization.Resource/save', this.resource)
        .subscribe(result => {
          if (result.id > 0) {
			      this.processResult(result, this.resource, this.messages, null);
			      this.resourceSaveEvent.emit(this.resource);
          } else {
            this.processResult(result, this.resource, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }
  
  clear() {
	this.messages = [];
	this.resource = new Resource();
  }

 }
