import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Product } from '../../models/product';
import { Reference } from '../../models/reference';
import { FileUploader } from './fileUploader';
import { EditorModule } from 'primeng/editor';
import { CategoryDropdown, ManufacturerDropdown } from '../dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule, MultiSelectModule, CalendarModule } from 'primeng/primeng';
import { GenericService, GlobalEventsManager } from '../../services';

@Component({
  selector: 'app-medicine-details',
  templateUrl: '../../pages/admin/medicineDetails.html',
  providers: [GenericService, CategoryDropdown, ManufacturerDropdown]
})
export class MedicineDetails implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  medicine: Product = new Product();
  categoryDropdown: CategoryDropdown;
  manufacturerDropdown: ManufacturerDropdown;
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  DEPARTMENT: string = Constants.DEPARTMENT;
  COUNTRY: string = Constants.COUNTRY;
  ROLE: string = Constants.ROLE;
  SELECT_OPTION: string = Constants.SELECT_OPTION;
  
  constructor
    (
      private genericService: GenericService,
      private globalEventsManager: GlobalEventsManager,
      private ctgDropdown: CategoryDropdown,
      private mfctDropdown: ManufacturerDropdown,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {
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
                else {
                  this.error = Constants.SAVE_UNSUCCESSFUL;
                  this.displayDialog = true;
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
    this.genericService.getOne(medicineId, 'Medicine')
        .subscribe(result => {
      if (result.id > 0) {
        this.medicine = result
      }
      else {
        this.error = Constants.SAVE_UNSUCCESSFUL;
        this.displayDialog = true;
      }
    })
  }
  
  save() {
    try {
      this.error = '';
      this.genericService.save(this.medicine, "Medicine")
        .subscribe(result => {
          if (result.id > 0) {
            this.medicine = result
          }
          else {
            this.error = Constants.SAVE_UNSUCCESSFUL;
            this.displayDialog = true;
          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }
  
  delete() {
    
  }

 }
