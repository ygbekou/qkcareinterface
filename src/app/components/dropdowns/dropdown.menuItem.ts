import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services';
import { MenuItem } from 'src/app/models/authorization/auth';
 
@Injectable()
export class MenuItemDropdown {
  
  filteredMenuItems: MenuItem[];
  menuItems: MenuItem[] = []; 
  
  constructor(
    private genericService: GenericService) {
    this.getAllMenuItems();
  }
  
  filter(event) {
    this.filteredMenuItems = DropdownUtil.filter(event, this.menuItems);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredMenuItems = this.menuItems;
    }, 10);
  }
  
  private getAllMenuItems(): void {
    const parameters: string [] = []; 
    parameters.push('e.status = |status|0|Integer');
    
    this.genericService.getAllByCriteria(MenuItem.PACKAGE, parameters)
      .subscribe((data: MenuItem[]) => { 
        this.menuItems = data; 
      },
      error => console.log(error),
      () => console.log('Get all Menu Items complete'));
  }
  
}
