import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services/generic.service';
import { Employee } from '../../models/Employee';
 
@Injectable()
export class MedicalTeamDropdown {
  
  filteredItems : Employee[];
  items : Employee[] = []; 
  
  constructor(
    private genericService: GenericService) {
    this.getAllItems();
  }
  
  filter(event) {
    this.filteredItems = DropdownUtil.filter(event, this.items);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredItems = this.items;
    }, 10)
  }
  
  private getAllItems(): void {
    let parameters: string [] = []; 
    parameters.push('e.user.userGroup.id IN |userGroupId|2,3|List');
    
    this.genericService.getAllByCriteria('Employee', parameters)
      .subscribe((data: Employee[]) => 
      { 
        this.items = data 
        console.info('this.items');
        console.info(this.items);
      },
      error => console.log(error),
      () => console.log('Get all items complete'));
  }
  
}