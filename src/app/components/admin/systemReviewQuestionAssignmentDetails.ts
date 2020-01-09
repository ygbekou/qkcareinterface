import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserGroupDropdown, SummaryTypeDropdown, CategoryDropdown, SystemReviewQuestionDropdown } from '../dropdowns';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { SummaryType, SystemReviewQuestionAssignment, UserGroup, PhysicalExamTypeAssignment } from 'src/app/models';

@Component({
  selector: 'app-systemReviewQuestionAssignment-details',
  templateUrl: '../../pages/admin/systemReviewQuestionAssignmentDetails.html',
  providers: [GenericService]
})
export class SystemReviewQuestionAssignmentDetails extends BaseComponent implements OnInit, OnDestroy {

  systemReviewQuestionAssignment: SystemReviewQuestionAssignment = new SystemReviewQuestionAssignment();

  selectedUserGroup: UserGroup = new UserGroup();
  messages: Message[] = [];
  @Input() canSave: boolean;
  @Output() systemReviewQuestionAssignmentSaveEvent = new EventEmitter<SystemReviewQuestionAssignment>();

  constructor
    (
      public genericService: GenericService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      private globalEventsManager: GlobalEventsManager,
      public userGroupDropdown: UserGroupDropdown,
      public summaryTypeDropdown: SummaryTypeDropdown,
      public categoryDropdown: CategoryDropdown,
      public systemReviewQuestionDropdown: SystemReviewQuestionDropdown,
      private route: ActivatedRoute
    ) {
      super(genericService, translate, confirmationService, tokenStorage);
      this.systemReviewQuestionDropdown.getGroupItems();
  }

  ngOnInit(): void {

    let systemReviewQuestionAssignmentId = null;
    this.route
        .queryParams
        .subscribe(params => {
          systemReviewQuestionAssignmentId = params['systemReviewQuestionAssignmentId'];

          if (systemReviewQuestionAssignmentId != null) {
              this.genericService.getOne(systemReviewQuestionAssignmentId, 'SystemReviewQuestionAssignment')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.systemReviewQuestionAssignment = result;
                } 
              });
          } else {

          }
        });

  }

  ngOnDestroy() {
    this.systemReviewQuestionAssignment = null;
  }

  save() {
    try {
      this.genericService.save(this.systemReviewQuestionAssignment, 'SystemReviewQuestionAssignment')
        .subscribe(result => {
          if (result.id > 0) {
			      this.systemReviewQuestionAssignment = result;
			      this.processResult(result, this.systemReviewQuestionAssignment, this.messages, null);
			      this.systemReviewQuestionAssignmentSaveEvent.emit(this.systemReviewQuestionAssignment);
          } else {
            this.processResult(result, this.systemReviewQuestionAssignment, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  getSystemReviewQuestionAssignment(itemId: number) {
    this.genericService.getOne(itemId, 'SystemReviewQuestionAssignment')
        .subscribe(result => {
      if (result.id > 0) {
        this.systemReviewQuestionAssignment = result;
        this.selectedUserGroup = this.systemReviewQuestionAssignment.summaryType.userGroup;
        this.summaryTypeDropdown.getSummaryTypeByRole(this.selectedUserGroup.id + '');
      } 
    });
  }

  populateSummaryTypeByRole(event: UserGroup) {
    
    this.systemReviewQuestionAssignment.summaryType = new SummaryType();
    
		this.summaryTypeDropdown.getSummaryTypeByRole(event.id + '');
  }

  clear() {
    this.systemReviewQuestionAssignment = new SystemReviewQuestionAssignment();
  }

 }
