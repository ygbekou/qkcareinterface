import { Component, OnInit, OnDestroy, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { ReferenceWithCategory } from '../../models/referenceWithCategory';
import { CategoryDropdown } from '../dropdowns';
import { GenericService, GlobalEventsManager } from '../../services';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { Reference } from 'src/app/models';

@Component({
  selector: 'app-referenceWithCategory-details',
  templateUrl: '../../pages/admin/referenceWithCategoryDetails.html',
  providers: [GenericService]
})
export class ReferenceWithCategoryDetails extends BaseComponent implements OnInit, OnDestroy {

  public error: String = '';
  displayDialog: boolean;
  referenceWithCategory: ReferenceWithCategory = new ReferenceWithCategory();
  referenceWithCategoryType: string;

  messages: Message[] = [];

  @Output() referenceWithCategorySaveEvent = new EventEmitter<ReferenceWithCategory>();

  constructor
    (
	  public genericService: GenericService,
	  public translate: TranslateService,
	  public confirmationService: ConfirmationService,
      private globalEventsManager: GlobalEventsManager,
      private categoryDropdown: CategoryDropdown,
      private route: ActivatedRoute
    ) {
		super(genericService, translate, confirmationService);
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
			this.processResult(result, this.referenceWithCategory, this.messages, null);
			this.referenceWithCategorySaveEvent.emit(this.referenceWithCategory);
          } else {
            this.processResult(result, this.referenceWithCategory, this.messages, null);
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

  clear() {
    this.referenceWithCategory = new ReferenceWithCategory();
    this.referenceWithCategory.category = new Reference();
  }

 }
