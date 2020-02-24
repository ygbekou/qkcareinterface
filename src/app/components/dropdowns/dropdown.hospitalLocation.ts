import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services/generic.service';
import { HospitalLocation } from '../../models';
 
@Injectable()
export class HospitalLocationDropdown {
  
  filteredLocations: HospitalLocation[];
  locations: HospitalLocation[] = []; 
  
  constructor(
    private genericService: GenericService) {
    this.getAllLocations();
  }
  
  filter(event) {
    this.filteredLocations = DropdownUtil.filter(event, this.locations);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredLocations = this.locations;
    }, 10);
  }
  
  private getAllLocations(): void {
    this.genericService.getAll('HospitalLocation')
      .subscribe((data: any[]) => {
        this.locations = data;
      },        
      error => console.log(error),
      () => console.log('Get All Locations Complete'));
  }
  
}
