import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services/generic.service';
import { Reference } from '../../models/reference';
 
@Injectable()
export class ExamStatusDropdown {
  
  filteredExamStatuses: Reference[];
  examStatuses: Reference[] = []; 
  
  constructor(
    private genericService: GenericService) {
    this.getAllExamStauses();
  }
  
  filter(event) {
    this.filteredExamStatuses = DropdownUtil.filter(event, this.examStatuses);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredExamStatuses = this.examStatuses;
    }, 10);
  }
  
  public getAllExamStauses(): void {
    this.genericService.getActiveElements('examStatus')
      .subscribe((data: any[]) => this.examStatuses = data,
      error => console.log(error),
      () => console.log('Get All examStatuses Complete'));
  }
  
}
