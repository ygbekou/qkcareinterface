import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, Role } from '../../models';
import { GenericService, GlobalEventsManager } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { RoleDropdown } from '../dropdowns';
import { BaseComponent } from '../admin/baseComponent';

@Component({
  selector: 'app-user_role-assignment',
  templateUrl: '../../pages/authorization/userRoleAssignment.html',
  providers: [GenericService]
})
export class UserRoleAssignment extends BaseComponent implements OnInit, OnDestroy {

  messages: Message[] = [];
  selectedUser: User = new User();

  constructor
    (
      public genericService: GenericService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public globalEventsManager: GlobalEventsManager,
      public roleDropdown: RoleDropdown
  ) {
      super(genericService, translate, confirmationService);
  }

  ngOnInit(): void {
  }


  ngOnDestroy() {
  }

  clear() {
    this.messages = [];
    this.selectedUser = new User();
    this.roleDropdown.resetRoles();
  }

  selectUser(user: User) {
    this.clear();
    this.selectedUser = user;
    for (const index in user.roles) {
      const role: Role = user.roles[index];
      const ind = this.roleDropdown.roles.findIndex(x => x.id === role.id);
      this.roleDropdown.roles.splice(ind, 1);
    }
  }
  

  save() {
    try {
      this.messages = [];
      
      this.genericService.saveWithUrl('/service/authorization/userRoles/save', this.selectedUser)
        .subscribe(result => {
          if (result.id > 0) {
			      this.processResult(result, this.selectedUser, this.messages, null);
			    } else {
            this.processResult(result, this.selectedUser, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }
}
