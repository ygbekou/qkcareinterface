import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services';
import { Reference } from '../../models/reference';
 
@Injectable()
export class LabTestDropdown {
  
  filteredLabTests : Reference[];
  labTests : Reference[] = []; 
  
  constructor(
    private genericService: GenericService) {
    this.getActiveLabTests();
  }
  
  filter(event) {
    this.filteredLabTests = DropdownUtil.filter(event, this.labTests);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredLabTests = this.labTests;
    }, 10)
  }
  
  public getActiveLabTests(): void {
    this.genericService.getActiveElements('labTest')
      .subscribe((data: any[]) => this.labTests = data,
      error => console.log(error),
      () => console.log('Get All labTests Complete'));
  }
  
}