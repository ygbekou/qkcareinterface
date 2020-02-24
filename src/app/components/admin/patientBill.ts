import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Bill, Patient } from '../../models';
import { GenericService, TokenStorage, BillingService, AppInfoStorage } from '../../services';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-patient-bill',
  templateUrl: '../../pages/admin/patientBill.html',
  providers: [GenericService, BillingService]
})
export class PatientBill extends BaseComponent implements OnInit, OnDestroy {
  serviceCols: any[];
  billPaymentCols: any[];
  bills: Bill[] = [];
  cols: any[];
  userId = '0';
  patient: Patient;
  bill: Bill;
  constructor
    (private billingService: BillingService,
      public genericService: GenericService,
      public translate: TranslateService,
      public tokenStorage: TokenStorage,
      public appInfoStorage: AppInfoStorage,
      public confirmationService: ConfirmationService,
      private router: Router,
  ) {

    super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    this.userId = this.tokenStorage.getUserId();
    this.getPatientAndBills();
    this.serviceCols = [
      {
        field: 'serviceDate', header: 'Date', headerKey: 'COMMON.DATE', type: 'date',
        style: { width: '8%', 'text-align': 'center' }
      },
      {
        field: 'doctorOrderTypeName', header: 'Type', headerKey: 'COMMON.SERVICE_TYPE', type: 'string',
        style: { width: '15%', 'text-align': 'center' }
      },
      {
        field: 'serviceName', header: 'Name', headerKey: 'COMMON.NAME', type: 'string',
        style: { width: '15%', 'text-align': 'center' }
      },
      {
        field: 'doctor', header: 'Doctor', headerKey: 'COMMON.DOCTOR', type: 'string',
        style: { width: '15%', 'text-align': 'center' }
      },
      {
        field: 'totalAmount', header: 'Total', headerKey: 'COMMON.TOTAL', type: 'number',
        style: { width: '7%', 'text-align': 'center' }
      },
      {
        field: 'discountAmount', header: 'Discount', headerKey: 'COMMON.DISCOUNT', type: 'number',
        style: { width: '10%', 'text-align': 'center' }
      },
      {
        field: 'netAmount', header: 'Price', headerKey: 'COMMON.NET_AMOUNT', type: 'number',
        style: { width: '10%', 'text-align': 'center' }
      },
      {
        field: 'payerAmount', header: 'Payer Amount', headerKey: 'COMMON.PAYER_AMOUNT', type: 'number',
        style: { width: '10%', 'text-align': 'center' }
      },
      {
        field: 'patientAmount', header: 'Patient Amount', headerKey: 'COMMON.PATIENT_AMOUNT', type: 'number',
        style: { width: '10%', 'text-align': 'center' }
      }
    ];

    this.billPaymentCols = [
      { field: 'paymentDate', header: 'Date', headerKey: 'COMMON.DATE', type: 'date' },
      { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'text' },
      { field: 'amount', header: 'Amount', headerKey: 'COMMON.AMOUNT', type: 'number' }
    ];

    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }

  updateCols() {
    // tslint:disable-next-line: forin
    for (const index in this.serviceCols) {
      const col = this.serviceCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }

    // tslint:disable-next-line: forin
    for (const index in this.billPaymentCols) {
      const col = this.billPaymentCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
  getPatientAndBills() {
    const parameters: string[] = [];
    this.bills = [];
    parameters.push('e.user.id = |userId|' + this.userId + '|Long');
    this.genericService.getAllByCriteria('Patient', parameters)
      .subscribe((data: Patient[]) => {
        this.patient = data[0];
        if (this.patient.id > 0) {
          const parameters2: string[] = [];
          parameters2.push('e.status = |status|0|Integer');
          parameters2.push('e.visit.patient.id = |id|' + this.patient.id + '|Long');
          this.genericService.getAllByCriteria('Bill', parameters2)
            .subscribe((data2: Bill[]) => {
              this.bills = data2;
              const parameters3: string[] = [];
              parameters3.push('e.status = |status|0|Integer');
              parameters3.push('e.admission.patient.id = |id|' + this.patient.id + '|Long');
              this.genericService.getAllByCriteria('Bill', parameters3)
                .subscribe((data3: Bill[]) => {
                  this.bills.concat(data3);
                },
                  error => console.log(error),
                  () => console.log('Get all Admission Bills complete'));

            },
              error => console.log(error),
              () => console.log('Get all Visit Bills complete'));
        }
      },
        error => console.log(error),
        () => console.log('Get all Patients complete'));
  }

  getBill(bill: Bill) {
    this.billingService.getBill(bill.id).subscribe(result => {
      if (result.id > 0) {
        this.bill = result;
        this.bill.billDate = new Date(this.bill.billDate);
        this.bill.dueDate = new Date(this.bill.dueDate);
      }
    });
  }
  ngOnDestroy() {
    this.bills = null;
  }

  edit(billId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'billId': billId,
        }
      };
      this.router.navigate(['/admin/billDetails'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

  delete(billId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'billId': billId,
        }
      };
      this.router.navigate(['/admin/billDetails'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

}
