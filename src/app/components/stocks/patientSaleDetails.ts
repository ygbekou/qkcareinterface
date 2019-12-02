import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Constants} from '../../app.constants';
import {Admission, Visit, Patient, Product} from '../../models';
import {PatientSale, PatientSaleProduct} from '../../models/stocks/patientSale';
import {ProductDropdown} from './../dropdowns';
import {GenericService, PurchasingService, GlobalEventsManager, TokenStorage} from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from '../admin/baseComponent';

@Component({
  selector: 'app-patientSale-details',
  templateUrl: '../../pages/stocks/patientSaleDetails.html',
  providers: [GenericService, PurchasingService, GlobalEventsManager, ProductDropdown]
})
export class PatientSaleDetails extends BaseComponent implements OnInit, OnDestroy {

  patientSale: PatientSale = new PatientSale();
  saleProductCols: any[];

  messages: Message[] = [];
  @Input() admission: Admission;
  @Input() visit: Visit;

  @Input() hideActionButtons: string;

  patient: Patient = new Patient();
  itemNumber: string;
  itemNumberLabel = 'Visit';
  
  isVisitOrAdmPage = false;

  constructor
    (
    public globalEventsManager: GlobalEventsManager,
    public genericService: GenericService,
    private purchasingService: PurchasingService,
    public translate: TranslateService,
    public confirmationService: ConfirmationService,
    public tokenStorage: TokenStorage,
    public productDropdown: ProductDropdown,
    private route: ActivatedRoute
    ) {
    super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {

     this.saleProductCols = [
            { field: 'product', header: 'Name', headerKey: 'COMMON.NAME', type: 'string', 
              style: {width: '15%', 'text-align': 'center'} },
            { field: 'productDescription', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'string', 
              style: {width: '15%', 'text-align': 'center'} },
            { field: 'quantity', header: 'Quantity', headerKey: 'COMMON.QUANTITY', type: 'amount', 
              style: {width: '8%', 'text-align': 'center'}},
            { field: 'unitPrice', header: 'Price', headerKey: 'COMMON.PRICE', type: 'amount', 
              style: {width: '8%', 'text-align': 'center'}},
            { field: 'discountPercentage', header: 'Discount %', headerKey: 'COMMON.DISCOUNT_PERCENTAGE', type: 'amount', 
              style: {width: '8%', 'text-align': 'center'}},
            { field: 'discountAmount', header: 'Discount Amt', headerKey: 'COMMON.DISCOUNT_AMOUNT', type: 'amount', 
              style: {width: '8%', 'text-align': 'center'}},
            { field: 'totalAmount', header: 'Total', headerKey: 'COMMON.TOTAL', type: 'amount', 
              style: {width: '8%', 'text-align': 'center'}}
        ]; 
    

    let patientSaleId = null;
    this.route
        .queryParams
        .subscribe(params => {          
          this.itemNumberLabel = params['itemNumberLabel'];
          patientSaleId = params['patientSaleId'];
          
          if (patientSaleId != null) {
              this.purchasingService.getPatientSale(patientSaleId)
                  .subscribe(result => {
                if (result.id > 0) {
                  this.patientSale = result;
                  this.visit = this.patientSale.visit;
                  this.admission = this.patientSale.admission;
                  this.setItemLabel();
                  if (this.patientSale.patientSaleProducts.length === 0) { 
                    this.addRow();
                  }
                }
              });
          } else {
              
          }
     });

   this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }
 
  
  updateCols() {
    for (let index in this.saleProductCols) {
      const col = this.saleProductCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }

  ngOnDestroy() {
    this.patientSale = null;
  }

  clear() {
    this.patientSale = new PatientSale();
  }
  
  reload(patientSaleId: number) {
     if (patientSaleId != null) {
          this.purchasingService.getPatientSale(patientSaleId)
              .subscribe(result => {
            if (result.id > 0) {
              this.patientSale = result;
              if (this.patientSale.patientSaleProducts.length === 0) { 
                this.addRow();
              }
            }
          });
      } else {
          
      }
  }

  updateSaleStatus(patientSaleStatusId: number) {
    try {
      this.messages = [];
      const oldSaleStatusId = this.patientSale.patientSaleStatus.id;
      this.patientSale.patientSaleStatus.id = patientSaleStatusId;
      const pops = this.patientSale.patientSaleProducts;
      
      this.genericService.save(this.patientSale, 'com.qkcare.model.stocks.PatientSale')
        .subscribe(result => {
          if (result.id > 0) {
            this.patientSale = result;
            this.patientSale.patientSaleProducts = pops;
            this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_SUCCESS']).subscribe(res => {
              this.messages.push({
                severity: Constants.SUCCESS, summary: res['COMMON.SAVE'],
                detail: res['MESSAGE.SAVE_SUCCESS']
              });
            });
          } else {
            this.patientSale.patientSaleStatus.id = oldSaleStatusId;
            this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_UNSUCCESS']).subscribe(res => {
                this.messages.push({
                    severity: Constants.ERROR, summary: res['COMMON.SAVE'],
                    detail: res['MESSAGE.SAVE_UNSUCCESS'] + result
                });
            });
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  validate() {
    let noProductFound = true;

    if ((this.visit === undefined || this.visit === null) 
      && (this.admission === undefined || this.admission === null)) {
      return;
    }
    
    for (const i in this.patientSale.patientSaleProducts) {
      const pp = this.patientSale.patientSaleProducts[i];
      if (pp.product && pp.product.id > 0) {
        noProductFound = false;
        if (pp.quantity == null) {
          this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:'Quantity is required.'});
        }
        if (pp.unitPrice == null) {
          this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:'Price is required.'});
        }
        
      }
    }
    
    if (noProductFound) {
      this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: 'At least 1 medication is required.'});
    }
    
    return this.messages.length === 0;
  }
  
  save() {

    try {
      this.messages = [];
       if (!this.validate()) {
        return;
      }
    
      this.patientSale.visit = this.visit;
      this.patientSale.admission = this.admission;

      this.purchasingService.savePatientSale(this.patientSale)
        .subscribe(result => {
          if (result.id > 0) {
            this.patientSale = result;
            this.messages.push({severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL});
          } else {
            this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL});
          }
        });
    } catch (e) {
      console.log(e);
    }
  }
  
  savePatientSaleProduct(patientSaleProduct: PatientSaleProduct) {

    try {
      patientSaleProduct.patientSale = new PatientSale();
      patientSaleProduct.patientSale.id = this.patientSale.id;
      patientSaleProduct.patientSale.patientSaleProducts = [];
      this.genericService.save(patientSaleProduct, "com.qkcare.model.stocks.PatientSaleProduct")
        .subscribe(result => {
          if (result.id > 0) {
            patientSaleProduct = result;
            this.messages.push({severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL});
          } else {
            this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL});
          }
        });
    } catch (e) {
      console.log(e);
    }
  }


  getPatientSale(patientSaleId: number) {
    this.messages = [];
    this.purchasingService.getPatientSale(patientSaleId)
        .subscribe(result => {
      if (result.id > 0) {
        this.patientSale = result;
        this.patientSale.saleDatetime = new Date(this.patientSale.saleDatetime);
      }
    });
  }
  
  addRow() {
    const psp =  new PatientSaleProduct();
    psp.product = new Product();
    this.patientSale.patientSaleProducts.push(psp);
  }

  updateStatus(id: number, status: number) {
    
    const psp = this.patientSale.patientSaleProducts.find(x => x.id === id);
    psp.status = status;
    this.savePatientSaleProduct(psp);
  }
  
  calculateGrandTotal() {
    this.calculateTotal();
    this.patientSale.grandTotal = +this.getNumber(this.patientSale.subTotal) + +this.getNumber(this.patientSale.taxes)
                    - +this.getNumber(this.patientSale.discount);

    this.patientSale.taxes = +this.getNumber(this.patientSale.taxes);
		this.patientSale.discount = +this.getNumber(this.patientSale.discount);
    this.patientSale.paid = +this.getNumber(this.patientSale.paid);
    this.patientSale.due = this.patientSale.grandTotal - +this.getNumber(this.patientSale.paid);

  }
  
  
  calculateTotal() {
    this.patientSale.subTotal = 0;
    this.patientSale.discount = 0;
    for (const i in this.patientSale.patientSaleProducts) {
       this.patientSale.subTotal += this.calculateRowTotal(this.patientSale.patientSaleProducts[i]);
       this.patientSale.discount += +this.getNumber(this.patientSale.patientSaleProducts[i].discountAmount);
    }
  }
  
  calculateRowTotal(rowData) {
    rowData.totalAmount = (+this.getNumber(rowData.quantity) * +this.getNumber(rowData.unitPrice));
    return rowData.totalAmount;
    
  }
  
  private getNumber(value: number): number {
    return value !== undefined ? value : 0;
  } 
  
  deleteRow(rowIndex: number) {
    const psp = this.patientSale.patientSaleProducts[rowIndex];

    if (psp.id !== null && psp.id !== undefined) {
      psp.status = 9;
      //this.calculateGrandTotal();
      this.save();
    } else {
      this.patientSale.patientSaleProducts.splice(rowIndex, 1);
    }
  }

  populateDefaultProductValues(rowData: PatientSaleProduct) {
    rowData.unitPrice = rowData.product.price;
  }
  
  lookUpVisitAdm(event) {
    if (this.itemNumberLabel === 'Visit') {
      this.visit = event;
    } else {
      this.admission = event;
    }
  }
  
  setItemLabel() {
    if (this.visit) {
      this.itemNumberLabel = 'Visit';
    } else {
      this.itemNumberLabel = 'Admission';
    }
  }

  isVisitOrAdmissionPage() {
    return this.isVisitOrAdmPage;
  }
}
