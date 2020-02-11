import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services/generic.service';
import { Department } from '../../models/department';
 
@Injectable()
export class DepartmentDropdown {
  
  filteredDepartments: Department[];
  departments: Department[] = []; 
  
  constructor(
    private genericService: GenericService) {
    this.getAllDepartments();
  }
  
  filter(event) {
    this.filteredDepartments = DropdownUtil.filter(event, this.departments);
  }
  
  handleDropdownClick(event) {
    //this.filteredDepartments = [];
    setTimeout(() => {
      this.filteredDepartments = this.departments;
    }, 10);
  }
  
  private getAllDepartments(): void {
    this.genericService.getAll('Department')
      .subscribe((data: any[]) => this.departments = data,
      error => console.log(error),
      () => console.log('Get All Departments Complete'));
  }
  
}
