import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Employee, Visit, User, SearchCriteria } from '../../models';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {  } from 'primeng/primeng';
import { GenericService, VisitService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-waiting-list',
  templateUrl: '../../pages/admin/waitingList.html',
  providers: [GenericService]
})
export class WaitingList implements OnInit, OnDestroy {
  
  visits: Visit[] = [];
  cols: any[];
  searchCriteria: SearchCriteria = new SearchCriteria();
  
  constructor
    (
    private genericService: GenericService,
    private visitService: VisitService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    ) {

    
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'id', header: 'Visit ID', headerKey: 'COMMON.VISIT_ID' },
            { field: 'doctorName', header: 'Date', headerKey: 'COMMON.DOCTOR' },
            { field: 'patientName', header: 'Patient Name', headerKey: 'COMMON.PATIENT_NAME' },
            { field: 'visitDatetime', header: 'Visit Date/Time', headerKey: 'COMMON.VISIT_DATETIME' }
        ];
    
    this.getWaitingList();
    
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
  
  updateStatus(visitId: number, status: number) {
    let visit = new Visit();
    visit.id = visitId;
    visit.status = status;
    
    this.visitService.updateStatus(visit)
        .subscribe(result => {
          if (result.id > 0) {
           this.getWaitingList();
          }
        })
  }
  
  
  getWaitingList() {
     this.route
        .queryParams
        .subscribe(params => {          
          
            let parameters: string [] = []; 
            
            let endDate = new Date();
            let startDate  = new Date(new Date().setDate(new Date().getDate() - 1));
            parameters.push('e.status = |status|1|Integer');
          
            this.genericService.getAllByCriteria('Visit', parameters)
              .subscribe((data: Visit[]) => 
              { 
                this.visits = data 
              },
              error => console.log(error),
              () => console.log('Get all visit complete'));
     });
  }
}

  