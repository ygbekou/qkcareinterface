import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services/generic.service';
import { Employee } from '../../models/Employee';
 
@Injectable()
export class RadiologyTechDropdown {
  
  filteredRadiologyTechs: Employee[];
  radiologyTechs: Employee[] = []; 
  
  constructor(
    private genericService: GenericService) {
    this.getAllRadiologyTechs();
  }
  
  filter(event) {
    this.filteredRadiologyTechs = DropdownUtil.filter(event, this.radiologyTechs);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredRadiologyTechs = this.radiologyTechs;
    }, 10);
  }
  
  private getAllRadiologyTechs(): void {
    const parameters: string [] = []; 
    parameters.push('e.user.userGroup.id = |userGroupId|4|Long');
    
    this.genericService.getAllByCriteria('Employee', parameters)
      .subscribe((data: Employee[]) => { 
        this.radiologyTechs = data; 
      },
      error => console.log(error),
      () => console.log('Get all Radiology Tech complete'));
  }
  
}
