import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { ReferenceWithCategory } from '../../models/referenceWithCategory';
import { CategoryDropdown } from '../dropdowns';
import { GenericService, GlobalEventsManager } from '../../services';

@Component({
  selector: 'app-referenceWithCategory-details',
  templateUrl: '../../pages/admin/referenceWithCategoryDetails.html',
  providers: [GenericService]
})
export class ReferenceWithCategoryDetails implements OnInit, OnDestroy {

  public error: String = '';
  displayDialog: boolean;
  referenceWithCategory: ReferenceWithCategory = new ReferenceWithCategory();
  referenceWithCategoryType: string;

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
      private categoryDropdown: CategoryDropdown,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {

  }

  ngOnInit(): void {

    let referenceWithCategoryId = null;
    let referenceWithCategoryType = null;
    this.route
        .queryParams
        .subscribe(params => {
          referenceWithCategoryId = params['referenceWithCategoryId'];
          referenceWithCategoryType = params['referenceWithCategoryType'];

          if (referenceWithCategoryId != null) {
              this.genericService.getOne(referenceWithCategoryId, referenceWithCategoryType)
                  .subscribe(result => {
                if (result.id > 0) {
                  this.referenceWithCategory = result;
                } else {
                  this.error = Constants.SAVE_UNSUCCESSFUL;
                  this.displayDialog = true;
                }
              });
          } else {

          }
        });

  }

  ngOnDestroy() {
    this.referenceWithCategory = null;
  }

  save() {
    try {
      this.error = '';
      this.genericService.save(this.referenceWithCategory, this.globalEventsManager.selectedReferenceWithCategoryType)
        .subscribe(result => {
          if (result.id > 0) {
            this.referenceWithCategory = result;
          } else {
            this.error = Constants.SAVE_UNSUCCESSFUL;
            this.displayDialog = true;
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  getReferenceWithCategory(referenceWithCategoryId: number, referenceWithCategoryType: string) {
    this.genericService.getOne(referenceWithCategoryId, referenceWithCategoryType)
        .subscribe(result => {
      if (result.id > 0) {
        this.referenceWithCategory = result;
      } else {
        this.error = Constants.SAVE_UNSUCCESSFUL;
        this.displayDialog = true;
      }
    });
  }

  delete() {

  }

 }
