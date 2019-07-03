import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Admission, Visit, DoctorOrder } from '../../models';
import { ConfirmationService, Message } from 'primeng/api';
import { GenericService, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { GenericResponse } from 'src/app/models/genericResponse';

@Component({
  selector: 'app-doctorOrder-list',
  templateUrl: '../../pages/admin/doctorOrderList.html',
  providers: [GenericService, ConfirmationService]
})
export class DoctorOrderList implements OnInit, OnDestroy {
  
  doctorOrders: DoctorOrder[] = [];
  cols: any[];
  messages: Message[] = [];
  
  @Input() visit: Visit;
  @Input() admission: Admission;
  @Output() doctorOrderIdEvent = new EventEmitter<string>();
  
  constructor
    (
	private genericService: GenericService,
	public globalEventsManager: GlobalEventsManager,
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute
    ) {

    
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'doctorOrderDatetime', header: 'Date Time', headerKey: 'COMMON.DOCTOR_ORDER_DATETIME', type: 'date_time',
                                        style: {width: '20%', 'text-align': 'center'} },
            { field: 'doctorOrderTypeName', header: 'Type', headerKey: 'COMMON.DOCTOR_ORDER_TYPE', type: 'string',
                                        style: {width: '20%', 'text-align': 'center'} },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'string',
                                        style: {width: '40%', 'text-align': 'center'}  },
            { field: 'doctorOrderStatusName', header: 'Status', headerKey: 'COMMON.STATUS', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'}  }
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

  delete(doctorOrderId: string) {
        this.messages = [];
        let confirmMessage = '';
        this.translate.get(['', 'MESSAGE.DELETE_CONFIRM']).subscribe(res => {
            confirmMessage = res['MESSAGE.DELETE_CONFIRM'];
        });

        this.confirmationService.confirm({
            message: confirmMessage,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.genericService.delete(+doctorOrderId, 'DoctorOrder')
                    .subscribe((response: GenericResponse) => {
                        if ('SUCCESS' === response.result) {
                            this.translate.get(['', 'MESSAGE.DELETE_SUCCESS']).subscribe(res => {
                                this.messages.push({
                                    severity: Constants.SUCCESS, summary: res['COMMON.DELETE'],
                                    detail: res['MESSAGE.DELETE_SUCCESS']
                                });
                            });
                            this.removeItem(+doctorOrderId)
                        } else if ('FAILURE' === response.result) {
                            this.translate.get(['', 'MESSAGE.DELETE_UNSUCCESS']).subscribe(res => {
                                this.messages.push({
                                    severity: Constants.ERROR, summary: res['COMMON.DELETE'],
                                    detail: res['MESSAGE.DELETE_UNSUCCESS']
                                });
                            });
                        }
                    });
            },
            reject: () => {
            }
        });

    }

  updateTable(doctorOrder: DoctorOrder) {
		let index = this.doctorOrders.findIndex(x => x.id === doctorOrder.id);
		
		if (index === -1) {
			this.doctorOrders.push(doctorOrder);
		} else {
			this.doctorOrders[index] = doctorOrder;
		}
		
	}

	removeItem(id: number) {

		let index = this.doctorOrders.findIndex(x => x.id === id);
		this.doctorOrders.splice(index, 1)

	}


 }
