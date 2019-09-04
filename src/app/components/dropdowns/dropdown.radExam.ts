import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services';
import { Reference } from '../../models/reference';
import { RadExam } from 'src/app/models/radiology/radiologyConfig';
 
@Injectable()
export class RadExamDropdown {
  
  filteredExams : RadExam[];
  exams : RadExam[] = []; 
  
  constructor(
    private genericService: GenericService) {
    this.getActiveExams();
  }
  
  filter(event) {
    this.filteredExams = DropdownUtil.filter(event, this.exams);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredExams = this.exams;
    }, 10)
  }
  
  public getActiveExams(): void {
    // this.genericService.getActiveElements('radExam')
    //   .subscribe((data: any[]) => this.exams = data,
    //   error => console.log(error),
    //   () => console.log('Get All Exams Complete'));
  }
  
}