import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services/generic.service';
import { Role } from '../../models';
 
@Injectable()
export class RoleDropdown {
  

  allRoles: Role[];
  filteredRoles: Role[];
  roles: Role[] = []; 
  
  constructor(
    private genericService: GenericService) {
    this.getAllRoles();
  }
  
  filter(event) {
    this.filteredRoles = DropdownUtil.filter(event, this.roles);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredRoles = this.roles;
    }, 10);
  }
  
  public resetRoles() {
    this.roles = this.allRoles.slice();
  }


  public getAllRoles(): void {
    const parameters: string [] = []; 
    parameters.push('e.status = |status|0|Integer');
    
    this.genericService.getAllByCriteria('com.qkcare.model.authorization.Role', parameters)
      .subscribe((data: Role[]) => { 
        this.allRoles = data.slice();
        this.roles = data; 
      },
      error => console.log(error),
      () => console.log('Get all Roles complete'));
  }
  
}
