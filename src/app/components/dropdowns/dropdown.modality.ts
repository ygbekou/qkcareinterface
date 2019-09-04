import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services/generic.service';
import { Reference } from '../../models/reference';
 
@Injectable()
export class ModalityDropdown {
  
  filteredModalities: Reference[];
  modalities: Reference[] = []; 
  
  constructor(
    private genericService: GenericService) {
    this.getModalities();
  }
  
  filter(event) {
    this.filteredModalities = DropdownUtil.filter(event, this.modalities);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredModalities = this.modalities;
    }, 10)
  }
  
  private getModalities(): void {
    let parameters: string [] = []; 
    parameters.push('e.status = |status|0|Integer');
    
    this.genericService.getAllByCriteria('com.qkcare.model.imaging.Modality', parameters)
      .subscribe((data: Reference[]) => 
      { 
        this.modalities = data 
      },
      error => console.log(error),
      () => console.log('Get Modalities complete'));
  }
  
}