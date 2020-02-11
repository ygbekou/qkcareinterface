import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Hospital } from '../../models';
import { Constants } from '../../app.constants';
import { CountryDropdown } from '../dropdowns';
import { GenericService } from '../../services';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-hospital-details',
  templateUrl: '../../pages/admin/hospitalDetails.html',
  providers: [GenericService, CountryDropdown]
})
// tslint:disable-next-line:component-class-suffix
export class HospitalDetails implements OnInit, OnDestroy {
  
  hospital: Hospital = new Hospital();

  @ViewChild('logo', {static: false}) logo: ElementRef;
  @ViewChild('favicon', {static: false}) favicon: ElementRef;
  @ViewChild('backgroundSlider', {static: false}) backgroundSlider: ElementRef;
  formData = new FormData();
  messages: Message[] = [];
  
  constructor
  (
      private genericService: GenericService    ) {

  }

  ngOnInit(): void {

    const parameters: string [] = []; 
    //parameters.push('e.status = |status|0|Integer');
    
      
    this.genericService.getAllByCriteria('Hospital', parameters)
       .subscribe((data: Hospital[]) => { 
          if (data.length > 0) {
            this.hospital = data[0];
          } else {
            this.hospital = new Hospital();
          }
        },
        error => console.log(error),
        () => console.log('Get Hospital complete'));
    
  }
  
  ngOnDestroy() {
    this.hospital = null;
  }
  
  save() {
    this.formData = new FormData();
    
    const logoEl = this.logo.nativeElement;
    if (logoEl && logoEl.files && (logoEl.files.length > 0)) {
      const files: FileList = logoEl.files;
      for (let i = 0; i < files.length; i++) {
          this.formData.append('logo', files[i], files[i].name);
      }
    } else {
       this.formData.append('logo', null, null);
    }
    
    const faviconEl = this.favicon.nativeElement;
    if (faviconEl && faviconEl.files && (faviconEl.files.length > 0)) {
      const files: FileList = faviconEl.files;
      for (let i = 0; i < files.length; i++) {
          this.formData.append('favicon', files[i], files[i].name);
      }
    } else {
       this.formData.append('favicon', null, null);
    }
    
    const backgroundSliderEl = this.backgroundSlider.nativeElement;
    if (backgroundSliderEl && backgroundSliderEl.files && (backgroundSliderEl.files.length > 0)) {
      const files: FileList = backgroundSliderEl.files;
      for (let i = 0; i < files.length; i++) {
          this.formData.append('backgroundSlider', files[i], files[i].name);
      }
    } else {
       this.formData.append('backgroundSlider', null, null);
    }
    
    
    try {
      if ((logoEl && logoEl.files && (logoEl.files.length > 0)) 
          || (faviconEl && faviconEl.files && (faviconEl.files.length > 0))
          || (backgroundSliderEl && backgroundSliderEl.files && (backgroundSliderEl.files.length > 0))
          ) {
        this.hospital.logo = '';
        this.hospital.favicon = '';
        this.genericService.saveWithFile(this.hospital, 'Hospital', this.formData, 'saveHospital')
          .subscribe(result => {
            if (result.id > 0) {
              this.hospital = result;
              this.messages.push({severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL});
            } else {
              this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL});
            }
          });
      } else {
        this.genericService.save(this.hospital, 'Hospital')
          .subscribe(result => {
            if (result.id > 0) {
              this.hospital = result;
              this.messages.push({severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL});
            } else {
              this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL});
            }
          });
      }
    } catch (e) {
      console.log(e);
    }
  }

 
 }
