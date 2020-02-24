import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services/generic.service';
import { Reference } from '../../models/reference';
 
@Injectable()
export class CodeStatusDropdown {
  
  filteredCodeStatuses: Reference[];
  codeStatuses: Reference[] = []; 
  
  constructor(
    private genericService: GenericService) {
    this.getAllCodeStatuses();
  }
  
  filter(event) {
    this.filteredCodeStatuses = DropdownUtil.filter(event, this.codeStatuses);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredCodeStatuses = this.codeStatuses;
    }, 10);
  }
  
  public getAllCodeStatuses(): void {
    this.genericService.getActiveElements('codeStatus')
      .subscribe((data: any[]) => this.codeStatuses = data,
      error => console.log(error),
      () => console.log('Get All codeStatuses Complete'));
  }
  
}
