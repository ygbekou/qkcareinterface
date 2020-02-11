import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserGroupDropdown } from '../dropdowns';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { SummaryType } from 'src/app/models';

@Component({
  selector: 'app-summary-type-details',
  templateUrl: '../../pages/admin/summaryTypeDetails.html',
  providers: [GenericService]
})
export class SummaryTypeDetails extends BaseComponent implements OnInit, OnDestroy {

  summaryType: SummaryType = new SummaryType();

  messages: Message[] = [];
  @Input() canSave: boolean;
  @Output() summaryTypeSaveEvent = new EventEmitter<SummaryType>();

  constructor
    (
      public genericService: GenericService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      private globalEventsManager: GlobalEventsManager,
      public userGroupDropdown: UserGroupDropdown,
      private route: ActivatedRoute
    ) {
		  super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {

    let summaryTypeId = null;
    this.route
        .queryParams
        .subscribe(params => {
          summaryTypeId = params['summaryTypeId'];

          if (summaryTypeId != null) {
              this.genericService.getOne(summaryTypeId, 'SummaryType')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.summaryType = result;
                } 
              });
          } else {

          }
        });

  }

  ngOnDestroy() {
    this.summaryType = null;
  }

  save() {
    try {
      this.genericService.save(this.summaryType, 'SummaryType')
        .subscribe(result => {
          if (result.id > 0) {
			      this.summaryType = result;
			      this.processResult(result, this.summaryType, this.messages, null);
			      this.summaryTypeSaveEvent.emit(this.summaryType);
          } else {
            this.processResult(result, this.summaryType, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  getSummaryType(summaryTypeId: number) {
    this.genericService.getOne(summaryTypeId, 'SummaryType')
        .subscribe(result => {
      if (result.id > 0) {
        this.summaryType = result;
      } 
    });
  }

  clear() {
    this.summaryType = new SummaryType();
  }

 }
