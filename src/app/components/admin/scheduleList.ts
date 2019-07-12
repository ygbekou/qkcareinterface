import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { Employee, Schedule, User } from '../../models';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { GenericService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-schedule-list',
  templateUrl: '../../pages/admin/scheduleList.html',
  providers: [GenericService]
})
export class ScheduleList implements OnInit, OnDestroy {
  
  schedules: Schedule[] = [];
  cols: any[];
  
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
            { field: 'departmentName', header: 'Department', headerKey: 'COMMON.DEPARTMENT'  },
            { field: 'locationName', header: 'Location', headerKey: 'COMMON.LOCATION' },
            { field: 'day', header: 'Available Day', headerKey: 'COMMON.AVAILABLE_DAYS' },
            { field: 'beginTime', header: 'Start Time', headerKey: 'COMMON.START_TIME' },
            { field: 'endTime', header: 'End Time', headerKey: 'COMMON.END_TIME' },
            { field: 'perPatientTime', header: 'Per Patient Time', headerKey: 'COMMON.PER_PATIENT_TIME' } 
        ];
    
    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.updateCols();
    });
    
    this.route
        .queryParams
        .subscribe(params => {          
          
            let parameters: string [] = []; 
            
            parameters.push('e.status = |status|0|Integer')
            
            this.genericService.getAllByCriteria('Schedule', parameters)
              .subscribe((data: Schedule[]) => 
              { 
                this.schedules = data 
                this.updateRowGroupMetaData();
              },
              error => console.log(error),
              () => console.log('Get all Schedule complete'));
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
  
  
  
  
  
  
  onSort() {
    this.updateRowGroupMetaData();
  }
  
  ngOnDestroy() {
    this.schedules = null;
  }
  
  edit(scheduleId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "scheduleId": scheduleId,
        }
      }
      this.router.navigate(["/admin/scheduleDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

  delete(scheduleId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "scheduleId": scheduleId,
        }
      }
      this.router.navigate(["/admin/scheduleDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }
  
  
  rowGroupMetadata: any;
  
  updateRowGroupMetaData() {
      
        this.rowGroupMetadata = {};
        if (this.schedules) {
            for (let i = 0; i < this.schedules.length; i++) {
                let rowData = this.schedules[i];
                let doctorName = rowData.doctorName;
                if (i == 0) {
                    this.rowGroupMetadata[doctorName] = { index: 0, size: 1 };
                }
                else {
                    let previousRowData = this.schedules[i - 1];
                    let previousRowGroup = previousRowData.doctorName;
                    if (doctorName === previousRowGroup)
                        this.rowGroupMetadata[doctorName].size++;
                    else
                        this.rowGroupMetadata[doctorName] = { index: i, size: 1 };
                }
            }
        }
    }

 }
