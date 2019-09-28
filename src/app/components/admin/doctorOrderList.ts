import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Admission, Visit, DoctorOrder } from '../../models';
import { ConfirmationService, Message } from 'primeng/api';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-doctorOrder-list',
  templateUrl: '../../pages/admin/doctorOrderList.html',
  providers: [GenericService, ConfirmationService]
})
export class DoctorOrderList extends BaseComponent implements OnInit, OnDestroy {

  doctorOrders: DoctorOrder[] = [];
  cols: any[];

  @Input() visit: Visit;
  @Input() admission: Admission;
  @Output() doctorOrderIdEvent = new EventEmitter<string>();

  constructor
    (
	  public genericService: GenericService,
	  public globalEventsManager: GlobalEventsManager,
    public translate: TranslateService,
    public confirmationService: ConfirmationService,
    public tokenStorage: TokenStorage,
    private route: ActivatedRoute
    ) {

    super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'doctorOrderDatetime', header: 'Date Time', headerKey: 'COMMON.DOCTOR_ORDER_DATETIME', type: 'date_time',
                                        style: {width: '20%', 'text-align': 'center'} },
            { field: 'doctorOrderTypeName', header: 'Type', headerKey: 'COMMON.DOCTOR_ORDER_TYPE', type: 'string',
                                        style: {width: '20%', 'text-align': 'center'} },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'html',
                                        style: {width: '40%', 'text-align': 'center'}  },
            { field: 'doctorOrderStatusName', header: 'Status', headerKey: 'COMMON.STATUS', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'}  }
        ];

		this.getList();
    
    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }


  updateCols() {
    for (let index in this.cols) {
      const col = this.cols[index];
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

  updateTable(doctorOrder: DoctorOrder) {
		const index = this.doctorOrders.findIndex(x => x.id === doctorOrder.id);

		if (index === -1) {
			this.doctorOrders.push(doctorOrder);
		} else {
			this.doctorOrders[index] = doctorOrder;
		}

	}

	getList()  {
		this.route
        .queryParams
        .subscribe(params => {

            const parameters: string [] = [];
            if (this.visit)  {
              parameters.push('e.visit.id = |visitId|' + this.visit.id + '|Long');
            }
            if (this.admission)  {
              parameters.push('e.admission.id = |admissionId|' + this.admission.id + '|Long');
            }

            this.genericService.getAllByCriteria('DoctorOrder', parameters, ' ORDER BY e.doctorOrderDatetime DESC ')
              .subscribe((data: DoctorOrder[]) =>
              {
                this.doctorOrders = data
              },
              error => console.log(error),
              () => console.log('Get all DoctorOrders complete'));
          });
  }
  
 }
