import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services/generic.service';
import { Reference } from '../../models/reference';
 
@Injectable()
export class LateralityDropdown {
  
  filteredLateralities: Reference[];
  lateralities: Reference[] = []; 
  
  constructor(
    private genericService: GenericService) {
    this.getAllLateralities();
  }
  
  filter(event) {
    this.filteredLateralities = DropdownUtil.filter(event, this.lateralities);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredLateralities = this.lateralities;
    }, 10);
  }
  
  public getAllLateralities(): void {
    this.genericService.getActiveElements('laterality')
      .subscribe((data: any[]) => this.lateralities = data,
      error => console.log(error),
      () => console.log('Get All lateralities Complete'));
  }
  
}
