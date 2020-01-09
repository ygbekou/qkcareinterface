import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService, GlobalEventsManager } from '../../services';
import { Reference } from '../../models/reference';
 
@Injectable()
export class PhysicalExamSystemDropdown {
  
  filteredItems: Reference[];
  items: Reference[] = []; 
  
  parentId: number;
  
  constructor(
    private genericService: GenericService,
    private globalEventsManager: GlobalEventsManager) {
  }
  
  filter(event) {
    this.filteredItems = DropdownUtil.filter(event, this.items);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredItems = this.items;
    }, 10)
  }
  
  public getAllItems(parentId: number): void {
    let parameters: string [] = []; 
    parameters.push('e.parent.id = |parentId|' + parentId + '' + '|Long');
    parameters.push('e.status = |status|0|Integer');
    
    this.genericService.getAllByCriteria('PhysicalExamSystem', parameters)
      .subscribe((data: Reference[]) => 
      { 
        this.items = data 
      },
      error => console.log(error),
      () => console.log('Get all items complete'));
  }
  
  public getGroupItems(): void {
    this.genericService.getActiveElements('physicalExamSystemType')
      .subscribe((data: any[]) => this.items = data,
      error => console.log(error),
      () => console.log('Get All items Complete'));
  }
  
}