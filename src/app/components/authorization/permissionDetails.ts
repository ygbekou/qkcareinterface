import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Role, Permission, Resource } from '../../models';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { RoleDropdown } from '../dropdowns';
import { BaseComponent } from '../admin/baseComponent';
import { ResourceList } from './resourceList';

@Component({
  selector: 'app-permission',
  templateUrl: '../../pages/authorization/permissionDetails.html',
  providers: []
})
export class PermissionDetails extends BaseComponent implements OnInit, OnDestroy {

  messages: Message[] = [];
  selectedRole: Role = new Role();
  cols: any[];


  @ViewChild('availableResourceList', {static: false}) availableResourceList: ResourceList;

  constructor
    (
      public genericService: GenericService,
      public translate: TranslateService,
      public tokenStorage: TokenStorage,
      public confirmationService: ConfirmationService,
      public globalEventsManager: GlobalEventsManager,
      public roleDropdown: RoleDropdown
  ) {
      super(genericService, translate, confirmationService, tokenStorage);
  }


  ngOnInit(): void {

    this.cols = [
          { field: 'resourceName', header: 'Name', headerKey: 'COMMON.NAME', type: 'string',
                                      style: {width: '30%', 'text-align': 'center'}, shouldSearch: 'Y' },
          { field: 'resourceUrlPath', header: 'Url Path', headerKey: 'COMMON.URL_PATH', type: 'string',
                                      style: {width: '40%', 'text-align': 'center'}, shouldSearch: 'Y' },
          { field: 'canAddBool', header: 'A', headerKey: 'COMMON.CAN_ADD', type: 'string',
                                      style: {width: '5%', 'text-align': 'center'} },
          { field: 'canEditBool', header: 'E', headerKey: 'COMMON.CAN_EDIT', type: 'string',
                                      style: {width: '5%', 'text-align': 'center'} },
          { field: 'canViewBool', header: 'V', headerKey: 'COMMON.CAN_VIEW', type: 'string',
                                      style: {width: '5%', 'text-align': 'center'} },
          { field: 'canDeleteBool', header: 'D', headerKey: 'COMMON.CAN_DELETE', type: 'string',
                                      style: {width: '5%', 'text-align': 'center'} }
      ];


      
  }


  ngOnDestroy() {
    this.selectedRole = null;
  }

  clear() {
    this.messages = [];
    this.selectedRole = new Role();
  }

  selectRole(role: Role) {
    this.clear();
    this.selectedRole = role;

     this.genericService.getNewObject('/service/authorization/role/get/', role.id)
        .subscribe(result => {
      if (result.id > 0) {
       this.selectedRole = result;
       this.availableResourceList.removeFromList(this.selectedRole.permissions);

      } 
    });
  }
  
  assignResource(resource: Resource) {
    const newPermission = new Permission(null, resource);
    this.selectedRole.permissions.push(newPermission);
  }

  save() {
    try {
      this.messages = [];
      
      this.genericService.saveWithUrl('/service/authorization/permissions/save', this.selectedRole)
        .subscribe(result => {
          if (result.id > 0) {
			      this.processResult(result, this.selectedRole, this.messages, null);
			    } else {
            this.processResult(result, this.selectedRole, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }


  unAssign(permission: Permission) {
    const ind = this.selectedRole.permissions.findIndex(x => x.id === permission.id);
    this.selectedRole.permissions.splice(ind, 1);

    this.availableResourceList.addToList(permission);
  }

}
