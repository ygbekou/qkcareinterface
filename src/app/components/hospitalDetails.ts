import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Department, Schedule, Employee, UserGroup, User, HospitalLocation, Country, Hospital } from '../models';
import { Constants } from '../app.constants';
import { EditorModule } from 'primeng/editor';
import { CountryDropdown } from './dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { InputTextareaModule, CheckboxModule, MultiSelectModule, CalendarModule } from 'primeng/primeng';
import { GenericService, UserService } from '../services';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-hospital-details',
  templateUrl: '../pages/hospitalDetails.html',
  providers: [GenericService, CountryDropdown]
})
// tslint:disable-next-line:component-class-suffix
export class HospitalDetails implements OnInit, OnDestroy {
  
  hospital: Hospital = new Hospital();

  @ViewChild('logo') logo: ElementRef;
  @ViewChild('favicon') favicon: ElementRef;
  @ViewChild('backgroundSlider') backgroundSlider: ElementRef;
  formData = new FormData();
  messages: Message[] = [];
  
  constructor
  (
      private genericService: GenericService,
      private userService: UserService,
      private countryDropdown: CountryDropdown,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {

  }

  ngOnInit(): void {

    let parameters: string [] = []; 
    //parameters.push('e.status = |status|0|Integer');
    
      
    this.genericService.getAllByCriteria('Hospital', parameters)
       .subscribe((data: Hospital[]) => 
        { 
          if (data.length > 0) {
            this.hospital = data[0]
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
    
    let logoEl = this.logo.nativeElement;
    if (logoEl && logoEl.files && (logoEl.files.length > 0)) {
      let files :FileList = logoEl.files;
      for(var i = 0; i < files.length; i++){
          this.formData.append('logo', files[i], files[i].name);
      }
    } else {
       this.formData.append('logo', null, null);
    }
    
    let faviconEl = this.favicon.nativeElement;
    if (faviconEl && faviconEl.files && (faviconEl.files.length > 0)) {
      let files :FileList = faviconEl.files;
      for(var i = 0; i < files.length; i++){
          this.formData.append('favicon', files[i], files[i].name);
      }
    } else {
       this.formData.append('favicon', null, null);
    }
    
    let backgroundSliderEl = this.backgroundSlider.nativeElement;
    if (backgroundSliderEl && backgroundSliderEl.files && (backgroundSliderEl.files.length > 0)) {
      let files :FileList = backgroundSliderEl.files;
      for(var i = 0; i < files.length; i++){
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
              this.messages.push({severity:Constants.SUCCESS, summary:Constants.SAVE_LABEL, detail:Constants.SAVE_SUCCESSFUL});
            }
            else {
              this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:Constants.SAVE_UNSUCCESSFUL});
            }
          })
      }
      else {
        this.genericService.save(this.hospital, 'Hospital')
          .subscribe(result => {
            if (result.id > 0) {
              this.hospital = result;
              this.messages.push({severity:Constants.SUCCESS, summary:Constants.SAVE_LABEL, detail:Constants.SAVE_SUCCESSFUL});
            }
            else {
              this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:Constants.SAVE_UNSUCCESSFUL});
            }
          })
      }
    }
    catch (e) {
      console.log(e);
    }
  }

 
 }
