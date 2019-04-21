import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { Admission, User, Visit, DoctorOrder, VitalSign } from '../../models';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { } from 'primeng/primeng';
import { GenericService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-doctorOrder-list',
  templateUrl: '../../pages/admin/doctorOrderList.html',
  providers: [GenericService]
})
export class DoctorOrderList implements OnInit, OnDestroy {
  
  doctorOrders: DoctorOrder[] = [];
  cols: any[];
  
  @Input() visit: Visit;
  @Input() admission: Admission;
  @Output() doctorOrderIdEvent = new EventEmitter<string>();
  
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
            { field: 'doctorOrderDatetime', header: 'Date Time', headerKey: 'COMMON.DOCTOR_ORDER_DATETIME', type:'date' },
            { field: 'doctorOrderTypeName', header: 'Type', headerKey: 'COMMON.DOCTOR_ORDER_TYPE' },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION' },
            { field: 'doctorOrderStatusName', header: 'Status', headerKey: 'COMMON.STATUS' }
        ];
    
    this.route
        .queryParams
        .subscribe(params => {          
          
            let parameters: string [] = []; 
            if (this.visit)  {
              parameters.push('e.visit.id = |visitId|' + this.visit.id + '|Long')
            } 
            if (this.admission)  {
              parameters.push('e.admission.id = |admissionId|' + this.admission.id + '|Long')
            } 
            
            this.genericService.getAllByCriteria('DoctorOrder', parameters)
              .subscribe((data: DoctorOrder[]) => 
              { 
                this.doctorOrders = data 
                console.info(this.doctorOrders);
              },
              error => console.log(error),
              () => console.log('Get all DoctorOrders complete'));
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
    this.doctorOrders = null;
  }
  
  edit(doctorOrderId: string) {
    this.doctorOrderIdEvent.emit(doctorOrderId);
  }

  delete(doctorOrderId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "doctorOrderId": doctorOrderId,
        }
      }
      this.router.navigate(["/admin/doctorOrderDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

 }
