import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services/generic.service';
import { Slider } from '../../models/website';

@Injectable()
export class SliderDropdown {

  filteredSliders: Slider[];
  sliders: Slider[] = [];

  constructor(
    private genericService: GenericService) {
    this.getAll();
  }

  filter(event) {
    this.filteredSliders = DropdownUtil.filter(event, this.sliders);
  }

  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredSliders = this.sliders;
    }, 10);
  }

  private getAll(): void {
    const parameters: string [] = [];
    this.genericService.getAllByCriteria('com.qkcare.model.website.Slider', parameters)
    .subscribe((data: Slider[]) => {
        this.sliders = data;
    },
    error => console.log(error),
    () => console.log('Get all Slider complete'));
  }
}
