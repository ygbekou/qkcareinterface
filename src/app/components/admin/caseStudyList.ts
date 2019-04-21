import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Employee } from '../../models/employee';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { CaseStudy } from '../../models/caseStudy';
import { Schedule } from '../../models/schedule';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { User } from '../../models/user';  
import { GenericService } from '../../services';

@Component({
  selector: 'app-caseStudy-list',
  templateUrl: '../../pages/admin/caseStudyList.html',
  providers: [GenericService]
})
export class CaseStudyList implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  caseStudies: CaseStudy[] = [];
  cols: any[];
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  
  constructor
    (
    private genericService: GenericService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    ) {

    
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'patientName', header: 'Patient' },
            { field: 'foodAllergies', header: 'Food Allergies' },
            { field: 'tendencyBleed', header: 'Tendency Bleed' },
            { field: 'heartDisease', header: 'Heart Disease' },
            { field: 'highBloodPressure', header: 'High Blood Pressure' },
            { field: 'diabetic', header: 'Diabetic' },
            { field: 'surgery', header: 'Surgery' },
            { field: 'accident', header: 'Accident' },
            { field: 'currentMedication', header: 'Current Medication' },
            { field: 'healthInsurance', header: 'Health Insurance' },
            { field: 'lowIncome', header: 'Low Income' },
            { field: 'status', header: 'Status', type:'string' }
        ];
    
    this.route
        .queryParams
        .subscribe(params => {          
          
            let parameters: string [] = []; 
            
            parameters.push('e.status = |status|0|Integer')
            
            this.genericService.getAllByCriteria('CaseStudy', parameters)
              .subscribe((data: CaseStudy[]) => 
              { 
                this.caseStudies = data 
              },
              error => console.log(error),
              () => console.log('Get all Case study complete'));
          });
  }
 
  
  ngOnDestroy() {
    this.caseStudies = null;
  }
  
  edit(caseStudyId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "caseStudyId": caseStudyId,
        }
      }
      this.router.navigate(["/admin/caseStudyDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

  delete(caseStudyId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "caseStudyId": caseStudyId,
        }
      }
      this.router.navigate(["/admin/caseStudyDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

 }
