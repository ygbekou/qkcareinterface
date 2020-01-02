import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services/generic.service';
import { Reference } from '../../models/reference';
 
@Injectable()
export class SummaryStatusDropdown {
  
  filteredSummaryStatuses: Reference[];
  summaryStatuses: Reference[] = []; 
  
  constructor(
    private genericService: GenericService) {
    this.getAllSummaryStatuses();
  }
  
  filter(event) {
    this.filteredSummaryStatuses = DropdownUtil.filter(event, this.summaryStatuses);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredSummaryStatuses = this.summaryStatuses;
    }, 10);
  }
  
  public getAllSummaryStatuses(): void {
    this.genericService.getActiveElements('summaryStatus')
      .subscribe((data: any[]) => this.summaryStatuses = data,
      error => console.log(error),
      () => console.log('Get All summaryStatuses Complete'));
  }
  
}
