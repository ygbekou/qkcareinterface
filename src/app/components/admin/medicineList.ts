import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { Product } from '../../models/product';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { GenericService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-medicine-list',
  templateUrl: '../../pages/admin/medicineList.html',
  providers: [GenericService]
})
export class MedicineList implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  medicines: Product[] = [];
  cols: any[];
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  
  @Output() medicineIdEvent = new EventEmitter<string>();
  
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
            parameters.push('e.category.id = |categoryId|' + Constants.CATEGORY_MEDICINE + '|Long')
            this.genericService.getAllByCriteria('Product', parameters)
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

  delete(medicineId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "medicineId": medicineId,
        }
      }
      this.router.navigate(["/admin/medicineDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

 }
