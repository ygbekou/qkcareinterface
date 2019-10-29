import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services';
import { Reference } from '../../models/reference';
import { LabTest } from 'src/app/models';
 
@Injectable()
export class LabTestDropdown {
  
  filteredLabTests : LabTest[];
  labTests : LabTest[] = []; 
  
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
    let parameters: string [] = []; 
    parameters.push('e.status = |status|0|Integer');
    
    this.genericService.getAllByCriteria('LabTest', parameters)
      .subscribe((data: LabTest[]) => 
      { 
        this.labTests = data 
      },
      error => console.log(error),
      () => console.log('Get all Religions complete'));
  }
  
}