import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Reference } from '../../models/reference';
import { Constants } from '../../app.constants';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService} from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-reference-details',
  templateUrl: '../../pages/admin/referenceDetails.html',
  providers: [GenericService]
  
})

export class ReferenceDetails extends BaseComponent implements OnInit, OnDestroy {
  
  reference: Reference = new Reference();
  category: Reference = new Reference();
  referenceType: string = null;
  parentId: number = null;
  
  hiddenMenu = false;
  messages: Message[] = [];
  
  @Input() canSave: boolean;
  @Output() referenceSaveEvent = new EventEmitter<Reference>();
 
  constructor
    (
      public genericService: GenericService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      private globalEventsManager: GlobalEventsManager,
      private route: ActivatedRoute    ) {
		    super(genericService, translate, confirmationService, tokenStorage);
      	this.reference = new Reference();
  	}

  
  
  ngOnInit(): void {
    this.reference = new Reference();
    let referenceId = null;
    this.route
        .queryParams
        .subscribe(params => {
          referenceId = params['referenceId'];
          if (this.referenceType == null && params['referenceType'] == null) {
             this.referenceType = this.globalEventsManager.selectedReferenceType;
             this.hiddenMenu = true;     
          } else {
            this.referenceType = params['referenceType'];
            this.hiddenMenu = false;
          }
          this.parentId = params['parentId'];
          if (this.parentId == null) {
            this.parentId = this.globalEventsManager.selectedParentId;
          } 
          
          if (referenceId != null) {
              this.genericService.getOne(referenceId, this.referenceType)
                  .subscribe(result => {
                if (result.id > 0) {
                  this.reference = result;
                }
                
              });
          }
        });
    
  }
  
  ngOnDestroy() {
    this.reference = null;
  	this.category = null;
  	this.referenceType = null;
  	this.parentId = null;
  	this.messages = null;
  }

  getReference(referenceId: number, referenceType: string) {
    this.messages = [];
    this.genericService.getOne(referenceId, referenceType)
        .subscribe(result => {
      if (result.id > 0) {
        this.reference = result;
      } else {
        this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
          this.messages.push({severity: Constants.ERROR, summary: res['COMMON.READ'], detail: res['MESSAGE.READ_FAILED']});
        });
      }
    });
  }
  
  clear() {
    this.reference = new Reference();
    this.reference.parent = new Reference();
    this.reference.parent.id = this.parentId;
  }
  
  save() {
    this.messages = [];
    try {
      this.reference.parent = new Reference();
      this.reference.parent.id = this.parentId;
      if (this.category.id > 0) {
        this.reference.parent.id = this.category.id;
        this.referenceType = 'Category';
      }

      if (this.globalEventsManager.selectedParentId > 0) {
        this.reference.parent.id = this.globalEventsManager.selectedParentId;
        this.referenceType = 'Category';
      }
      
      this.genericService.save(this.reference, this.globalEventsManager.selectedReferenceType)
        .subscribe(result => {
          if (result.id > 0) {
			this.processResult(result, this.reference, this.messages, null);
			this.reference = result;
			this.referenceSaveEvent.emit(this.reference);
          } else {
            this.processResult(result, this.reference, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

 }
