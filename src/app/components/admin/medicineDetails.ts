import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Product } from '../../models/product';
import { Reference } from '../../models/reference';
import { CategoryDropdown, ManufacturerDropdown } from '../dropdowns';
import { GenericService, GlobalEventsManager } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-medicine-details',
  templateUrl: '../../pages/admin/medicineDetails.html',
  providers: [GenericService, CategoryDropdown, ManufacturerDropdown]
})
export class MedicineDetails extends BaseComponent implements OnInit, OnDestroy {
  
  	medicine: Product = new Product();
  	categoryDropdown: CategoryDropdown;
  	manufacturerDropdown: ManufacturerDropdown;

	@Output() medicineSaveEvent = new EventEmitter<Product>();
  
  
  constructor
    (
	  public genericService: GenericService,
	  public translate: TranslateService,
	  public confirmationService: ConfirmationService,
      private globalEventsManager: GlobalEventsManager,
      private ctgDropdown: CategoryDropdown,
      private mfctDropdown: ManufacturerDropdown,
      private route: ActivatedRoute
    ) {
		super(genericService, translate, confirmationService);
     	this.categoryDropdown = ctgDropdown;
      	this.manufacturerDropdown = mfctDropdown;
      	this.categoryDropdown.getAllCategories(Constants.CATEGORY_MEDICINE);
  }

  ngOnInit(): void {

    let medicineId = null;
    this.route
        .queryParams
        .subscribe(params => {          
          
          this.medicine.category = new Reference();
          
          medicineId = params['medicineId'];
          
          if (medicineId != null) {
              this.genericService.getOne(medicineId, 'Medicine')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.medicine = result
                }
              })
          } else {
              
          }
        });
    
  }
  
  ngOnDestroy() {
    this.medicine = null;
  }

  getMedicine(medicineId: number) {
    this.genericService.getOne(medicineId, 'Product')
        .subscribe(result => {
      if (result.id > 0) {
        this.medicine = result
      }
    })
  }
  
  save() {
    try {
      this.genericService.save(this.medicine, "Product")
        .subscribe(result => {
          if (result.id > 0) {
			this.processResult(result, this.medicine, this.messages, null);
			this.medicine = result;
			this.medicineSaveEvent.emit(this.medicine);
          } else {
            this.processResult(result, this.medicine, this.messages, null);
          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }
  
  addNew() {
  	this.messages = [];
    this.medicine = new Product();
  }

 }
