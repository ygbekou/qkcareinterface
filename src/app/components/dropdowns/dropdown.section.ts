import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services/generic.service';
import { Section } from '../../models/website';

@Injectable()
export class SectionDropdown {

  filteredSections: Section[];
  sections: Section[] = [];

  constructor(
    private genericService: GenericService) {
    this.getAllSections();
  }

  filter(event) {
    this.filteredSections = DropdownUtil.filter(event, this.sections);
  }

  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredSections = this.sections;
      console.log(this.filteredSections);
    }, 10)
  }

  private getAllSections(): void {
    this.genericService.getAll('com.qkcare.model.website.Section')
      .subscribe((data: any[]) => {
        this.sections = data
        console.log(data);
      },
        error => console.log(error),
        () => console.log('Get All Sections Complete'));
  }

}