import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services/generic.service';
import { Reference } from '../../models/reference';
 
@Injectable()
export class SurgicalProcedureDropdown {
  
  filteredSurgicalProcedures: Reference[];
  surgicalProcedures: Reference[] = []; 
  
  constructor(
    private genericService: GenericService) {
    this.getSurgicalProcedures();
  }
  
  filter(event) {
    this.filteredSurgicalProcedures = DropdownUtil.filter(event, this.surgicalProcedures);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredSurgicalProcedures = this.surgicalProcedures;
    }, 10)
  }
  
  private getSurgicalProcedures(): void {
    this.genericService.getAll('SurgicalProcedure')
      .subscribe((data: any[]) => {
        this.surgicalProcedures = data
      },
        
      error => console.log(error),
      () => console.log('Get Surgical Procedures Complete'));
  }
  
}