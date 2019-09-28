import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Schedule } from '../../models';
import { ConfirmationService } from 'primeng/primeng';
import { GenericService, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-schedule-list',
  templateUrl: '../../pages/admin/scheduleList.html',
  providers: [GenericService]
})
export class ScheduleList extends BaseComponent implements OnInit, OnDestroy {
  
  schedules: Schedule[] = [];
  cols: any[];
  
  constructor
    (
    public genericService: GenericService,
    public translate: TranslateService,
    public confirmationService: ConfirmationService, 
    public tokenStorage: TokenStorage, 
    private route: ActivatedRoute,
    private router: Router,
    ) {
      super(genericService, translate, confirmationService, tokenStorage);
    
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
          
            const parameters: string [] = []; 
            
            parameters.push('e.status = |status|0|Integer');
            
            this.genericService.getAllByCriteria('Schedule', parameters)
              .subscribe((data: Schedule[]) => { 
                this.schedules = data; 
                this.updateRowGroupMetaData();
              },
              error => console.log(error),
              () => console.log('Get all Schedule complete'));
          });
  }
 
 updateCols() {
    for (const index in this.cols) {
      const col = this.cols[index];
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
  
  edit(scheduleId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'scheduleId': scheduleId,
        }
      };
      this.router.navigate(['/admin/scheduleDetails'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

  delete(scheduleId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'scheduleId': scheduleId,
        }
      };
      this.router.navigate(['/admin/scheduleDetails'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }
  
  
  rowGroupMetadata: any;
  
  updateRowGroupMetaData() {
      
        this.rowGroupMetadata = {};
        if (this.schedules) {
            for (let i = 0; i < this.schedules.length; i++) {
                const rowData = this.schedules[i];
                const doctorName = rowData.doctorName;
                if (i === 0) {
                    this.rowGroupMetadata[doctorName] = { index: 0, size: 1 };
                } else {
                    const previousRowData = this.schedules[i - 1];
                    const previousRowGroup = previousRowData.doctorName;
                    if (doctorName === previousRowGroup) {
                        this.rowGroupMetadata[doctorName].size++;
                    } else {
                        this.rowGroupMetadata[doctorName] = { index: i, size: 1 };
                    }
                }
            }
        }
    }

 }
