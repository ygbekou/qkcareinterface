import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Admission, Visit, SearchCriteria } from '../../models';
import { PatientSale } from '../../models/stocks/patientSale';
import { ToolbarModule, ConfirmationService } from 'primeng/primeng';
import { GenericService, PurchasingService, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from '../admin/baseComponent';

@Component({ 
  selector: 'app-patientSale-list',
  templateUrl: '../../pages/stocks/patientSaleList.html',
  providers: [GenericService, PurchasingService, ToolbarModule] 
})
  
export class PatientSaleList extends BaseComponent implements OnInit, OnDestroy {
  
  patientSales: PatientSale[] = [];
  cols: any[];
  
  @Input() admission: Admission;
  @Input() visit: Visit;
  @Output() patientSaleIdEvent = new EventEmitter<string>();
  
  searchCriteria: SearchCriteria = new SearchCriteria();
  
  constructor
    (
    private genericService: GenericService,
    private purchasingService: PurchasingService,
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
            { field: 'saleDatetime', header: 'Date time', headerKey: 'COMMON.SALE_DATETIME', type: 'date' },
            { field: 'patientId', header: 'MRN', headerKey: 'COMMON.PATIENT_ID' },
            { field: 'patientName', header: 'Patient', headerKey: 'COMMON.PATIENT_NAME' },
            { field: 'subTotal', header: 'Sub Total', headerKey: 'COMMON.SUBTOTAL' },
            { field: 'taxes', header: 'Taxes', headerKey: 'COMMON.TAXES' },
            { field: 'discount', header: 'Discount', headerKey: 'COMMON.DISCOUNT' },
            { field: 'grandTotal', header: 'Grand Total', headerKey: 'COMMON.GRANDTOTAL' },
            { field: 'status', header: 'Status', headerKey: 'COMMON.STATUS', type: 'string' }
        ];
    
    this.route
        .queryParams
        .subscribe(params => {          
          
            const parameters: string [] = []; 
          
            parameters.push('e.status = |status|0|Integer');
            if (this.visit && this.visit.id > 0) { 
              parameters.push('e.visit.id = |visitId|' + this.visit.id + '|Long');
            }
            if (this.admission && this.admission.id > 0) { 
              parameters.push('e.admission.id = |admissionId|' + this.admission.id + '|Long');
            }
          
            this.genericService.getAllByCriteria('com.qkcare.model.stocks.PatientSale', parameters)
              .subscribe((data: PatientSale[]) => { 
                this.patientSales = data; 
              },
              error => console.log(error),
              () => console.log('Get all PatientSale complete'));
          });
    
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
    this.patientSales = null;
  }
  
  edit(patientSaleId: string) {
    try {
      if (this.visit || this.admission) {
        this.patientSaleIdEvent.emit(patientSaleId);
      } else {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            'patientSaleId': patientSaleId,
          }
        };
        this.router.navigate(['/admin/patientSaleDetails'], navigationExtras);
      }
    } catch (e) {
      console.log(e);
    }
  }

  delete(patientSaleId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'patientSaleId': patientSaleId,
        }
      };
      this.router.navigate(['/admin/patientSaleDetails'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

    search() {
   
    const parameters: string [] = []; 
        
    parameters.push('e.status = |status|0|Integer');
    if (this.searchCriteria.visitId != null)  {
      parameters.push('e.visit.id = |visitId|' + this.searchCriteria.visitId + '|Long');
    }
    if (this.searchCriteria.medicalRecordNumber != null && this.searchCriteria.medicalRecordNumber.length > 0)  {
      parameters.push('e.visit.patient.medicalRecordNumber = |medicalRecordNumber|' + this.searchCriteria.medicalRecordNumber + '|String');
    }
    if (this.searchCriteria.lastName != null && this.searchCriteria.lastName.length > 0)  {
      parameters.push('e.visit.patient.user.lastName like |lastName|' + '%' + this.searchCriteria.lastName + '%' + '|String');
    }
    if (this.searchCriteria.firstName != null && this.searchCriteria.firstName.length > 0)  {
      parameters.push('e.visit.patient.user.firstName like |firstName|' + '%' + this.searchCriteria.firstName + '%' + '|String');
    } 
    
    this.genericService.getAllByCriteria('PatientSale', parameters)
      .subscribe((data: PatientSale[]) => { 
        this.patientSales = data; 
      },
      error => console.log(error),
      () => console.log('Get all Patient Sales complete'));
  }
  
  isVisitOrAdmissionPage() {
    return ((this.visit && this.visit.id > 0) || (this.admission && this.admission.id > 0));
  }
 }
