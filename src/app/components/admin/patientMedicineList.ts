import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Visit, Admission } from '../../models';
import { Router } from '@angular/router';
import { GenericService, AdmissionService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';
import { PatientSaleProduct } from 'src/app/models/stocks/patientSale';

@Component({
  selector: 'app-patientMedicine-list',
  templateUrl: '../../pages/admin/patientMedicineList.html',
  providers: [GenericService, AdmissionService]
})
export class PatientMedicineList extends BaseComponent implements OnInit, OnDestroy {
  
  patientSaleProducts: PatientSaleProduct[] = [];
  cols: any[];
  
  @Input() admission: Admission;
  @Input() visit: Visit;
  @Output() prescriptionIdEvent = new EventEmitter<string>();
  
  constructor
    (
    public globalEventsManager: GlobalEventsManager,
    public genericService: GenericService,
    public translate: TranslateService,
    public confirmationService: ConfirmationService,
    public tokenStorage: TokenStorage,
    private router: Router,
    ) {
		super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'saleDatetime', header: 'Date', headerKey: 'COMMON.SALE_DATETIME', type: 'date_time',
                                        style: {width: '15%', 'text-align': 'center'} },
            { field: 'productName', header: 'Type', headerKey: 'COMMON.MEDICINE', type: 'string',
                                        style: {width: '20%', 'text-align': 'center'} },
            { field: 'notes', header: 'Notes', headerKey: 'COMMON.NOTES', type: 'string',
                                        style: {width: '35%', 'text-align': 'center'} },
            { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'} }
        ];
    this.getSaleProducts();
  
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
    this.patientSaleProducts = null;
  }
  
   getSaleProducts() {
     
      const parameters: string [] = []; 
            
        //parameters.push('ps.status = |status|0|Integer')
        if (this.visit && this.visit.id > 0)  {
          parameters.push('ps.visit.id = |visitId|' + this.visit.id + '|Long');
        } 
        if (this.admission && this.admission.id > 0)  {
          parameters.push('ps.admission.id = |admissionId|' + this.admission.id + '|Long');
        } 
        
        
		this.genericService.getAllByCriteria('PatientSale ps, PatientSaleProduct', parameters, 
				' ORDER BY ps.saleDatetime DESC, e.product.name')
          .subscribe((data: PatientSaleProduct[]) => { 
            this.patientSaleProducts = data; 
          },
          error => console.log(error),
          () => console.log('Get all PatientSaleProduct complete'));
	  }
    
    
  updateStatus(id: number, status: number) {
    
    const psp = this.patientSaleProducts.find(x => x.id === id);
    psp.status = status;
    this.savePatientSaleProduct(psp, '/service/purchasing/patientSaleProduct/save');
  }

  savePatientSaleProduct(patientSaleProduct: PatientSaleProduct, url: string) {
    this.messages = [];
    try {
      this.genericService.saveAnyWithUrl(url, patientSaleProduct)
        .subscribe(result => {
          if (result.id > 0) {
            this.processResult(result, patientSaleProduct, this.messages, null);
            patientSaleProduct = result;
            const index = this.patientSaleProducts.findIndex(x => x.id === patientSaleProduct.id);
            this.patientSaleProducts[index] = patientSaleProduct;
          } else {
            this.processResult(result, patientSaleProduct, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }


 }
