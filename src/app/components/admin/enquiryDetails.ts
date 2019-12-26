import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Enquiry } from '../../models';
import { Constants } from '../../app.constants';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ConfirmationService } from 'primeng/api';
import { GenericService, TokenStorage } from '../../services';
import { TranslateService} from '@ngx-translate/core';
import { Message } from 'primeng/api';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-enquiry-details',
  templateUrl: '../../pages/admin/enquiryDetails.html',
  providers: [GenericService]
  
})
export class EnquiryDetails extends BaseComponent implements OnInit, OnDestroy {
  
  enquiry: Enquiry = new Enquiry();
  messages: Message[] = [];
 
  constructor
    (
      public genericService: GenericService,
      public confirmationService: ConfirmationService,
      public translate: TranslateService,
      public tokenStorage: TokenStorage,
      private route: ActivatedRoute,
      private router: Router
    ) {
      super(genericService, translate, confirmationService, tokenStorage);
  }

  
  ngOnInit(): void {
    this.enquiry = new Enquiry();
    let enquiryId = null;
    this.route
        .queryParams
        .subscribe(params => {
          enquiryId = params['enquiryId'];
          if (enquiryId != null) {
              this.genericService.getOne(enquiryId, 'Enquiry')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.enquiry = result;
                }
                
              });
          }
        });
    
  }
  
  ngOnDestroy() {
    this.enquiry = null;
  }

  getReference(enquiryId: number) {
    this.messages = [];
    this.genericService.getOne(enquiryId, 'Enquiry')
        .subscribe(result => {
      if (result.id > 0) {
        this.enquiry = result;
      } else {
        this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
          this.messages.push({severity: Constants.ERROR, summary: res['COMMON.READ'], detail: res['MESSAGE.READ_FAILED']});
        });
      }
    });
  }
  
  clear() {
    this.enquiry = new Enquiry();
  }
  
  save(saveType: number = 1) {
    this.messages = [];
    try {
      
      if (saveType == null || saveType === 1) {
        this.enquiry.enquiryDatetime = new Date();
      } else if (saveType === 2) {
        this.enquiry.read = 'Y';
        this.enquiry.checkedBy = JSON.parse(Cookie.get('user'));
      }

      this.genericService.save(this.enquiry, 'Enquiry')
        .subscribe(result => {
          if (result.id > 0) {
            this.enquiry = result;
            this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_SUCCESS']).subscribe(res => {
              this.messages.push({severity: Constants.SUCCESS, summary: res['COMMON.SAVE'], detail: res['MESSAGE.SAVE_SUCCESS']});
            });
          } else {
            this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_UNSUCCESS']).subscribe(res => {
              this.messages.push({severity: Constants.SUCCESS, summary: res['COMMON.SAVE'], detail: res['MESSAGE.SAVE_UNSUCCESS']});
            });
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

 }
