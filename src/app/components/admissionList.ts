import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Employee } from '../models/employee';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../app.constants';
import { SearchCriteria } from '../models';
import { Admission } from '../models/admission';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { User } from '../models/user';  
import { GenericService } from '../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-patientAdmission-list',
  templateUrl: '../pages/admissionList.html',
  providers: [GenericService]
})
export class AdmissionList implements OnInit, OnDestroy {
  
  admissions: Admission[] = [];
  cols: any[];
  
  searchCriteria: SearchCriteria = new SearchCriteria();
  
  constructor
    (
    private genericService: GenericService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    ) {

    
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'admissionNumber', header: 'Admission No', headerKey: 'COMMON.ADMISSION_NUMBER' },
            { field: 'admissionDatetime', header: 'Date/Time', headerKey: 'COMMON.ADMISSION_DATETIME', type:'date' },
            { field: 'patientId', header: 'Patient ID', headerKey: 'COMMON.PATIENT_ID' },
            { field: 'patientName', header: 'Patient Name', headerKey: 'COMMON.PATIENT_NAME' },
            { field: 'status', header: 'Status', headerKey: 'COMMON.STATUS', type:'string' }
        ];
    
    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.updateCols();
    });
    
    // Get all admission of the last 24 hrs;
    this.route
        .queryParams
        .subscribe(params => {          
          
            let parameters: string [] = []; 
            
            let endDate = new Date();
            let startDate  = new Date(new Date().setDate(new Date().getDate() - 1));
            parameters.push('e.admissionDatetime >= |admissionDateStart|' + startDate.toLocaleDateString() + ' ' + startDate.toLocaleTimeString() + '|Timestamp');
            parameters.push('e.admissionDatetime < |admissionDateEnd|' + endDate.toLocaleDateString() + ' ' + endDate.toLocaleTimeString() + '|Timestamp');
            
            this.genericService.getAllByCriteria('Admission', parameters)
              .subscribe((data: Admission[]) => 
              { 
                this.admissions = data 
              },
              error => console.log(error),
              () => console.log('Get all Admission complete'));
          });
  }
 
  updateCols() {
    for (var index in this.cols) {
      let col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
  
  ngOnDestroy() {
    this.admissions = null;
  }
  
  edit(admissionId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "admissionId": admissionId,
        }
      }
      this.router.navigate(["/admin/admissionDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

  delete(admissionId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "admissionId": admissionId,
        }
      }
      this.router.navigate(["/admin/admissionDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }
  
  
  search() {
   
    let parameters: string [] = []; 
        
    if (this.searchCriteria.medicalRecordNumber != null && this.searchCriteria.medicalRecordNumber.length > 0)  {
      parameters.push('e.patient.medicalRecordNumber = |medicalRecordNumber|' + this.searchCriteria.medicalRecordNumber + '|String');
    }
    if (this.searchCriteria.lastName != null && this.searchCriteria.lastName.length > 0)  {
      parameters.push('e.patient.user.lastName like |lastName|' + '%' + this.searchCriteria.lastName + '%' + '|String');
    }
    if (this.searchCriteria.firstName != null && this.searchCriteria.firstName.length > 0)  {
      parameters.push('e.patient.user.firstName like |firstName|' + '%' + this.searchCriteria.firstName + '%' + '|String');
    } 
    if (this.searchCriteria.birthDate != null)  {
      parameters.push('e.patient.user.birthDate = |birthDate|' + this.searchCriteria.birthDate.toLocaleDateString() + '|Date');
    }  
    if (this.searchCriteria.admissionId != null)  {
      parameters.push('e.id = |admissionId|' + this.searchCriteria.admissionId + '|Long');
    }
    if (this.searchCriteria.admissionDate != null)  {
      let startDate = new Date(this.searchCriteria.admissionDate.setDate(this.searchCriteria.admissionDate.getDate()));
      let endDate  = new Date(this.searchCriteria.admissionDate.setDate(this.searchCriteria.admissionDate.getDate() + 1));
      parameters.push('e.admissionDatetime >= |admissionDateStart|' + startDate.toLocaleDateString() + '|Timestamp');
      parameters.push('e.admissionDatetime < |admissionDateEnd|' + endDate.toLocaleString() + '|Timestamp');
    } 
    
    this.genericService.getAllByCriteria('Admission', parameters)
      .subscribe((data: Admission[]) => 
      { 
        this.admissions = data 
      },
      error => console.log(error),
      () => console.log('Get all Admissions complete'));
  }

 }
