import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Constants } from '../../app.constants';
import { GenericService, TokenStorage } from '../../services';
import { Message, ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ContactUsMessage } from '../../models/website';
import { BaseComponent } from './baseComponent';


@Component({
  selector: 'app-contact-details',
  templateUrl: '../../pages/admin/contactDetails.html',
  providers: [GenericService]
})
// tslint:disable-next-line:component-class-suffix 
export class ContactDetails extends BaseComponent implements OnInit, OnDestroy {

  contactUsMessage: ContactUsMessage = new ContactUsMessage();
  messages: Message[] = [];

  constructor
  (
      public genericService: GenericService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
    ) {
      super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {


  }

  ngOnDestroy() {
    this.contactUsMessage = null;
  }

 getContact(contactId: number) {
    this.messages = [];
    this.genericService.getOne(contactId, 'ContactUsMessage')
        .subscribe(result => {
      if (result.id > 0) {
        this.contactUsMessage = result;
      } else {
        this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
          this.messages.push({severity:
            Constants.ERROR, summary:
            res['COMMON.READ'], detail:
            res['MESSAGE.READ_FAILED']});
        });
      }
    });
  }

  clear() {
    this.contactUsMessage = new ContactUsMessage();
  }
  delete() {
    
  }
 }
