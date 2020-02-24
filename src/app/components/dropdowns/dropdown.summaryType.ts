import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services/generic.service';
import { TokenStorage } from 'src/app/services';
import { SummaryType } from 'src/app/models';
 
@Injectable()
export class SummaryTypeDropdown {
  
  filteredSummaryTypes: SummaryType[];
  summaryTypes: SummaryType[] = []; 
  
  constructor(
    private genericService: GenericService,
    public tokenStorage: TokenStorage) {
      this.getSummaryTypeByRole(undefined);
  }
  
  filter(event) {
    this.filteredSummaryTypes = DropdownUtil.filter(event, this.summaryTypes);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredSummaryTypes = this.summaryTypes;
    }, 10);
  }
  
  public getSummaryTypeByRole(roleId: string): void {
    const parameters: string [] = [];
    parameters.push('e.userGroup.id = |userGroupId|' + (roleId ? roleId : this.tokenStorage.getRole()) + '|Long');

    this.genericService.getAllByCriteria('SummaryType', parameters, '')
      .subscribe((data: SummaryType[]) =>
      {
        if (data.length > 0) {
          this.summaryTypes = data;
          console.info(this.summaryTypes)
        }
      },
      error => console.log(error),
      () => console.log('Get all summary types completed'));
  }
  
}
