import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services/generic.service';
import { Employee } from '../../models/Employee';
 
@Injectable()
export class DoctorDropdown {
  
  filteredDoctors: Employee[];
  doctors: Employee[] = []; 
  
  constructor(
    private genericService: GenericService) {
    this.getAllDoctors();
  }
  
  filter(event) {
    this.filteredDoctors = DropdownUtil.filter(event, this.doctors);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredDoctors = this.doctors;
    }, 10);
  }
  
  private getAllDoctors(): void {
    const parameters: string [] = []; 
    parameters.push('e.user.userGroup.id = |userGroupId|2|Long');
    
    this.genericService.getAllByCriteria('Employee', parameters)
      .subscribe((data: Employee[]) => { 
        this.doctors = data; 
      },
      error => console.log(error),
      () => console.log('Get all Doctors complete'));
  }
  
}
