import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services/generic.service';
import { Reference } from '../../models/reference';
 
@Injectable()
export class BodyPartDropdown {
  
  filteredBodyParts: Reference[];
  bodyParts: Reference[] = []; 
  
  constructor(
    private genericService: GenericService) {
    this.getAllBodyPsrts();
  }
  
  filter(event) {
    this.filteredBodyParts = DropdownUtil.filter(event, this.bodyParts);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredBodyParts = this.bodyParts;
    }, 10);
  }
  
  public getAllBodyPsrts(): void {
    this.genericService.getActiveElements('bodyPart')
      .subscribe((data: any[]) => this.bodyParts = data,
      error => console.log(error),
      () => console.log('Get All bodyParts Complete'));
  }
  
}
