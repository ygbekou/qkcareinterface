import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserGroupDropdown, SummaryTypeDropdown, CategoryDropdown, PhysicalExamSystemDropdown } from '../dropdowns';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { SummaryType, PhysicalExamTypeAssignment, UserGroup } from 'src/app/models';

@Component({
  selector: 'app-physicalExamTypeAssignment-details',
  templateUrl: '../../pages/admin/physicalExamTypeAssignmentDetails.html',
  providers: [GenericService]
})
export class PhysicalExamTypeAssignmentDetails extends BaseComponent implements OnInit, OnDestroy {

  physicalExamTypeAssignment: PhysicalExamTypeAssignment = new PhysicalExamTypeAssignment();

  selectedUserGroup: UserGroup = new UserGroup();
  messages: Message[] = [];
  @Input() canSave: boolean;
  @Output() physicalExamTypeAssignmentSaveEvent = new EventEmitter<PhysicalExamTypeAssignment>();

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
      public physicalExamSystemDropdown: PhysicalExamSystemDropdown,
      private route: ActivatedRoute
    ) {
      super(genericService, translate, confirmationService, tokenStorage);
      this.physicalExamSystemDropdown.getGroupItems();
  }

  ngOnInit(): void {

    let physicalExamTypeAssignmentId = null;
    this.route
        .queryParams
        .subscribe(params => {
          physicalExamTypeAssignmentId = params['physicalExamTypeAssignmentId'];

          if (physicalExamTypeAssignmentId != null) {
              this.genericService.getOne(physicalExamTypeAssignmentId, 'PhysicalExamTypeAssignment')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.physicalExamTypeAssignment = result;
                } 
              });
          } else {

          }
        });

  }

  ngOnDestroy() {
    this.physicalExamTypeAssignment = null;
  }

  save() {
    try {
      this.genericService.save(this.physicalExamTypeAssignment, 'PhysicalExamTypeAssignment')
        .subscribe(result => {
          if (result.id > 0) {
			      this.physicalExamTypeAssignment = result;
			      this.processResult(result, this.physicalExamTypeAssignment, this.messages, null);
			      this.physicalExamTypeAssignmentSaveEvent.emit(this.physicalExamTypeAssignment);
          } else {
            this.processResult(result, this.physicalExamTypeAssignment, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  getPhysicalExamTypeAssignment(itemId: number) {
    this.genericService.getOne(itemId, 'PhysicalExamTypeAssignment')
        .subscribe(result => {
      if (result.id > 0) {
        this.physicalExamTypeAssignment = result;
        this.selectedUserGroup = this.physicalExamTypeAssignment.summaryType.userGroup;
        this.summaryTypeDropdown.getSummaryTypeByRole(this.selectedUserGroup.id + '');
      } 
    });
  }

  populateSummaryTypeByRole(event: UserGroup) {
    
    this.physicalExamTypeAssignment.summaryType = new SummaryType();
    
		this.summaryTypeDropdown.getSummaryTypeByRole(event.id + '');
  }

  clear() {
    this.physicalExamTypeAssignment = new PhysicalExamTypeAssignment();
  }

 }
