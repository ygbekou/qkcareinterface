import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../app.constants';
import { CaseStudy } from '../models/caseStudy';
import { Patient } from '../models/patient';
import { EditorModule } from 'primeng/editor';
import { DoctorDropdown, WeekdayDropdown } from './dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule, MultiSelectModule, CalendarModule } from 'primeng/primeng';
import { User } from '../models/user';  
import { GenericService, UserService } from '../services';

@Component({
  selector: 'app-caseStudy-details',
  templateUrl: '../pages/caseStudyDetails.html',
  providers: [GenericService]
})
export class CaseStudyDetails implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  caseStudy: CaseStudy = new CaseStudy();
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  DEPARTMENT: string = Constants.DEPARTMENT;
  COUNTRY: string = Constants.COUNTRY;
  ROLE: string = Constants.ROLE;
  SELECT_OPTION: string = Constants.SELECT_OPTION;
  
  constructor
    (
      private genericService: GenericService,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {
    
  }

  ngOnInit(): void {

    let caseStudyId = null;
    this.route
        .queryParams
        .subscribe(params => {          
          
          this.caseStudy.patient = new Patient();
          
          caseStudyId = params['caseStudyId'];
          
          if (caseStudyId != null) {
              this.genericService.getOne(caseStudyId, 'CaseStudy')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.caseStudy = result
                }
                else {
                  this.error = Constants.SAVE_UNSUCCESSFUL;
                  this.displayDialog = true;
                }
              })
          } else {
              
          }
     });
    
  }
  
  ngOnDestroy() {
    this.caseStudy = null;
  }

  save() {
    try {
      this.error = '';
      this.genericService.save(this.caseStudy, "CaseStudy")
        .subscribe(result => {
          if (result.id > 0) {
            this.caseStudy = result
          }
          else {
            this.error = Constants.SAVE_UNSUCCESSFUL;
            this.displayDialog = true;
          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }
  
  delete() {
    
  }

 }
