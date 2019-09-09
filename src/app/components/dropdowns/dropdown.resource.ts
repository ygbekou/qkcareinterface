import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services';
import { Resource } from 'src/app/models/authorization/auth';
 
@Injectable()
export class ResourceDropdown {
  
  filteredResources: Resource[];
  resources: Resource[] = []; 
  
  constructor(
    private genericService: GenericService) {
    this.getAllResources();
  }
  
  filter(event) {
    this.filteredResources = DropdownUtil.filter(event, this.resources);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredResources = this.resources;
    }, 10);
  }
  
  private getAllResources(): void {
    const parameters: string [] = []; 
    parameters.push('e.status = |status|0|Integer');
    
    this.genericService.getAllByCriteria('com.qkcare.model.authorization.Resource', parameters)
      .subscribe((data: Resource[]) => { 
        this.resources = data; 
      },
      error => console.log(error),
      () => console.log('Get all Resources complete'));
  }
  
}
