import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services/generic.service';
import { Service } from '../../models/service';
 
@Injectable()
export class ServiceDropdown {
  
  filteredServices : Service[];
  services : Service[] = []; 
  
  constructor(
    private genericService: GenericService) {
    //this.getAllServices();
  }
  
  filter(event) {
    this.filteredServices = DropdownUtil.filter(event, this.services);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredServices = this.services;
    }, 10)
  }
  
  private getAllServices(): void {
    this.genericService.getAll('Service')
      .subscribe((data: any[]) => {
        this.services = data
      },
        
      error => console.log(error),
      () => console.log('Get All Services Complete'));
  }
  
  public getServices(serviceTypeId: number): void {
	let parameters: string [] = []; 
            
    parameters.push('e.serviceType.id = |serviceTypeId|' + serviceTypeId + '|Long')
    
    this.genericService.getAllByCriteria('Service', parameters)
      .subscribe((data: any[]) => {
        this.services = data
        
      },
        
      error => console.log(error),
      () => console.log('Get services Complete'));
  }
  
}