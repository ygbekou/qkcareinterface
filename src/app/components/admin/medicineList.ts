import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Product } from '../../models/product';
import { GenericService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-medicine-list',
  templateUrl: '../../pages/admin/medicineList.html',
  providers: [GenericService]
})
export class MedicineList extends BaseComponent implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  medicines: Product[] = [];
  cols: any[];
  
  @Output() medicineIdEvent = new EventEmitter<string>();
  
  constructor
    (
    private genericService: GenericService,
	private translate: TranslateService,
	public confirmationService: ConfirmationService,
    private route: ActivatedRoute
    ) {
		super(genericService, translate, confirmationService);
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'categoryName', header: 'Category', headerKey: 'COMMON.CATEGORY' },
            { field: 'manufacturerName', header: 'Manufacturer', headerKey: 'COMMON.MANUFACTURER' },
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME' },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION'},
            { field: 'price', header: 'Price', headerKey: 'COMMON.PRICE' },
            { field: 'status', header: 'Status', headerKey: 'COMMON.STATUS', type:'string' }
        ];
    
    this.route
        .queryParams
        .subscribe(params => {
          
            let parameters: string [] = [];
            
            parameters.push('e.status = |status|0|Integer')
            parameters.push('c.parent.id = |categoryId|' + Constants.CATEGORY_MEDICINE + '|Long')
            this.genericService.getAllByCriteria('Product.Category', parameters)
              .subscribe((data: Product[]) => 
              {
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
    for (var index in this.cols) {
      let col = this.cols[index];
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

 }
