import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BuildingDropdown, ResourceDropdown } from '../dropdowns';
import { Message, ConfirmationService } from 'primeng/api';
import { GenericService, TokenStorage } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../admin/baseComponent';
import { Role } from 'src/app/models';

@Component({
  selector: 'app-role-details',
  templateUrl: '../../pages/authorization/roleDetails.html',
  providers: [GenericService, BuildingDropdown, ResourceDropdown]
  
})
export class RoleDetails extends BaseComponent implements OnInit, OnDestroy {
  
  messages: Message[] = [];
  role: Role = new Role();

  @Output() roleSaveEvent = new EventEmitter<Role>();
  
  constructor
    (
	    public genericService: GenericService,
	    public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      private route: ActivatedRoute,
      public resourceDropdown: ResourceDropdown
    ) {
		    super(genericService, translate, confirmationService, tokenStorage);
      	this.role = new Role();
  }
  
  ngOnInit(): void {
    this.role = new Role();
  }
  
  ngOnDestroy() {
    this.role = null;
  }

  getRole(roleId: number) {
    this.genericService.getOne(roleId, 'com.qkcare.model.authorization.Role')
        .subscribe(result => {
      if (result.id > 0) {
        this.role = result;
      }
    });
  }
  
  clear() {
    this.role = new Role();
  }
  
  save() {
    try {
      this.messages = [];
      
      this.genericService.save(this.role, 'com.qkcare.model.authorization.Role')
        .subscribe(result => {
          if (result.id > 0) {
			      this.processResult(result, this.role, this.messages, null);			      
            this.roleSaveEvent.emit(result);
            this.clear();
          } else {
            this.processResult(result, this.role, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }
  
 }
