import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Product } from '../../models/product';
import { GenericService, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-medicine-list',
  templateUrl: '../../pages/admin/medicineList.html',
  providers: [GenericService]
})
export class MedicineList extends BaseComponent implements OnInit, OnDestroy {
  
  medicines: Product[] = [];
  cols: any[];
  
  @Output() medicineIdEvent = new EventEmitter<string>();
  
  constructor
    (
    public genericService: GenericService,
    public translate: TranslateService,
    public confirmationService: ConfirmationService,
    public tokenStorage: TokenStorage,
    private route: ActivatedRoute
    ) {
		super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'categoryName', header: 'Category', headerKey: 'COMMON.CATEGORY', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'} },
            { field: 'manufacturerName', header: 'Manufacturer', headerKey: 'COMMON.MANUFACTURER', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'} },
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME', type: 'string',
                                        style: {width: '15%', 'text-align': 'center'} },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'string',
                                        style: {width: '30%', 'text-align': 'center'} },
            { field: 'price', header: 'Price', headerKey: 'COMMON.PRICE', type: 'string',
                                        style: {width: '8%', 'text-align': 'center'} },
            { field: 'quantityInStock', header: 'Quantity', headerKey: 'COMMON.QUANTITY', type: 'string',
                                        style: {width: '8%', 'text-align': 'center'} },
            { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS' , type: 'string',
                                        style: {width: '8%', 'text-align': 'center'} }
        ];
    
    this.route
        .queryParams
        .subscribe(params => {
          
            const parameters: string [] = [];
            
            parameters.push('e.status = |status|0|Integer');
            parameters.push('c.parent.id = |categoryId|' + Constants.CATEGORY_MEDICINE + '|Long');
            this.genericService.getAllByCriteria('Product.Category', parameters, ' ORDER BY e.name ')
              .subscribe((data: Product[]) => {
                this.medicines = data;
              },
              error => console.log(error),
              () => console.log('Get all Medicine complete'));
          });
  
      this.updateCols();
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
          this.updateCols();
      });
  }
 
  
  updateCols() {
    // tslint:disable-next-line: forin
    for (const index in this.cols) {
      const col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }

  }
 
  
  ngOnDestroy() {
    this.medicines = null;
  }
  
  edit(medicineId: number) {
      this.medicineIdEvent.emit(medicineId + '');
  }

  updateTable(medicine: Product) {
		const index = this.medicines.findIndex(x => x.id === medicine.id);

		if (index === -1) {
			this.medicines.push(medicine);
		} else {
			this.medicines[index] = medicine;
		}

	}

 }
