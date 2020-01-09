import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserGroupDropdown, SummaryTypeDropdown } from '../dropdowns';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { SummaryType, UserGroup, SummaryTypeTemplate } from 'src/app/models';

@Component({
  selector: 'app-summary-type-template-details',
  templateUrl: '../../pages/admin/summaryTypeTemplateDetails.html',
  providers: [GenericService]
})
export class SummaryTypeTemplateDetails extends BaseComponent implements OnInit, OnDestroy {

  summaryTypeTemplate: SummaryTypeTemplate = new SummaryTypeTemplate();
  selectedUserGroup: UserGroup = new UserGroup();
  messages: Message[] = [];
  @Input() canSave: boolean;
  @Output() summaryTypeTemplateSaveEvent = new EventEmitter<SummaryTypeTemplate>();

  constructor
    (
      public genericService: GenericService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      private globalEventsManager: GlobalEventsManager,
      public userGroupDropdown: UserGroupDropdown,
      public summaryTypeDropdown: SummaryTypeDropdown,
      private route: ActivatedRoute
    ) {
      super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {

    let summaryTypeTemplateId = null;
    this.route
        .queryParams
        .subscribe(params => {
          summaryTypeTemplateId = params['summaryTypeTemplateId'];

          if (summaryTypeTemplateId != null) {
              this.genericService.getOne(summaryTypeTemplateId, 'SummaryTypeTemplate')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.summaryTypeTemplate = result;
                } 
              });
          } else {

          }
        });

  }

  ngOnDestroy() {
    this.summaryTypeTemplate = null;
  }

  save() {
    try {
      this.genericService.save(this.summaryTypeTemplate, 'SummaryTypeTemplate')
        .subscribe(result => {
          if (result.id > 0) {
			      this.summaryTypeTemplate = result;
			      this.processResult(result, this.summaryTypeTemplate, this.messages, null);
			      this.summaryTypeTemplateSaveEvent.emit(this.summaryTypeTemplate);
          } else {
            this.processResult(result, this.summaryTypeTemplate, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  getSummaryTypeTemplate(itemId: number) {
    this.genericService.getOne(itemId, 'SummaryTypeTemplate')
        .subscribe(result => {
      if (result.id > 0) {
        this.summaryTypeTemplate = result;
        this.selectedUserGroup = this.summaryTypeTemplate.summaryType.userGroup;
        this.summaryTypeDropdown.getSummaryTypeByRole(this.selectedUserGroup.id + '');
      } 
    });
  }

  populateSummaryTypeByRole(event: UserGroup) {
    
    this.summaryTypeTemplate.summaryType = new SummaryType();
		this.summaryTypeDropdown.getSummaryTypeByRole(event.id + '');
  }

  clear() {
    this.summaryTypeTemplate = new SummaryTypeTemplate();
  }

 }
