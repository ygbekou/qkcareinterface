import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Employee, Visit, User, SearchCriteria } from '../../models';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {  } from 'primeng/primeng';
import { GenericService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-visit-list',
  templateUrl: '../../pages/admin/visitList.html',
  providers: [GenericService]
})
export class VisitList implements OnInit, OnDestroy {
  
  visits: Visit[] = [];
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
            { field: 'id', header: 'Visit ID', headerKey: 'COMMON.VISIT_ID' },
            { field: 'visitDatetime', header: 'Date', headerKey: 'COMMON.VISIT_DATETIME', type:'date' },
            { field: 'patientId', header: 'Patient ID', headerKey: 'COMMON.PATIENT_ID' },
            { field: 'patientName', header: 'Patient Name', headerKey: 'COMMON.PATIENT_NAME' },
            { field: 'status', header: 'Status', type:'string', headerKey: 'COMMON.STATUS' }
        ];
    
    this.route
        .queryParams
        .subscribe(params => {          
          
            let parameters: string [] = []; 
            
            let endDate = new Date();
            let startDate  = new Date(new Date().setDate(new Date().getDate() - 1));
            parameters.push('e.visitDatetime >= |visitDateStart|' + startDate.toLocaleDateString() + ' ' + startDate.toLocaleTimeString() + '|Timestamp');
            parameters.push('e.visitDatetime < |visitDateEnd|' + endDate.toLocaleDateString() + ' ' + endDate.toLocaleTimeString() + '|Timestamp');
            
            this.genericService.getAllByCriteria('Visit', parameters)
              .subscribe((data: Visit[]) => 
              { 
                this.visits = data 
              },
              error => console.log(error),
              () => console.log('Get all Admission complete'));
          });
    
    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
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
    this.visits = null;
  }
  
  edit(visitId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "visitId": visitId,
        }
      }
      this.router.navigate(["/admin/visitDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

  delete(visitId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "visitId": visitId,
        }
      }
      this.router.navigate(["/admin/visitDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

  search() {
   
    let parameters: string [] = []; 
        
    parameters.push('e.status = |status|0|Integer')
     if (this.searchCriteria.medicalRecordNumber != null && this.searchCriteria.medicalRecordNumber.length > 0)  {
      parameters.push('e.patient.medicalRecordNumber = |medicalRecordNumber|' + this.searchCriteria.medicalRecordNumber + '|String')
    }
    if (this.searchCriteria.lastName != null && this.searchCriteria.lastName.length > 0)  {
      parameters.push('e.patient.user.lastName like |lastName|' + '%' + this.searchCriteria.lastName + '%' + '|String')
    }
    if (this.searchCriteria.firstName != null && this.searchCriteria.firstName.length > 0)  {
      parameters.push('e.patient.user.firstName like |firstName|' + '%' + this.searchCriteria.firstName + '%' + '|String')
    } 
    if (this.searchCriteria.birthDate != null)  {
      parameters.push('e.patient.user.birthDate = |birthDate|' + this.searchCriteria.birthDate.toLocaleDateString() + '|Date')
    }  
    if (this.searchCriteria.visitId != null && this.searchCriteria.visitId > 0)  {
      parameters.push('e.id = |visitId|' + this.searchCriteria.visitId + '|Long');
    }
    if (this.searchCriteria.visitDate != null)  {
      let startDate = new Date(new Date().setDate(this.searchCriteria.visitDate.getDate()));
      let endDate  = new Date(new Date().setDate(this.searchCriteria.visitDate.getDate() + 1));
      parameters.push('e.visitDatetime >= |visitDateStart|' + startDate.toLocaleDateString() + '|Timestamp');
      parameters.push('e.visitDatetime < |visitDateEnd|' + endDate.toLocaleString() + '|Timestamp');
    } 
    
    this.genericService.getAllByCriteria('Visit', parameters)
      .subscribe((data: Visit[]) => 
      { 
        this.visits = data 
      },
      error => console.log(error),
      () => console.log('Get all Visits complete'));
  }
 }
