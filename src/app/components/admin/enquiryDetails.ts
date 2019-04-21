import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Enquiry, User } from '../../models';
import { Constants } from '../../app.constants';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { GenericService, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-enquiry-details',
  templateUrl: '../../pages/admin/enquiryDetails.html',
  providers: [GenericService]
  
})
export class EnquiryDetails implements OnInit, OnDestroy {
  
  enquiry: Enquiry = new Enquiry();
  messages: Message[] = [];
 
  constructor
    (
      private genericService: GenericService,
      private translate: TranslateService,
      private route: ActivatedRoute,
      private router: Router
    ) {

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
                
              })
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
      }
      else {
        this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
          this.messages.push({severity:Constants.ERROR, summary:res['COMMON.READ'], detail:res['MESSAGE.READ_FAILED']});
        });
      }
    })
  }
  
  clear() {
    this.enquiry = new Enquiry();
  }
  
  save(saveType : number = 1) {
    this.messages = [];
    try {
      
      if (saveType == null || saveType == 1) {
        this.enquiry.enquiryDatetime = new Date();
      } else if (saveType == 2) {
        this.enquiry.read = 'Y';
        this.enquiry.checkedBy = JSON.parse(Cookie.get('user'));
      }

      console.info(this.enquiry)
      this.genericService.save(this.enquiry, 'Enquiry')
        .subscribe(result => {
          if (result.id > 0) {
            this.enquiry = result;
            this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_SUCCESS']).subscribe(res => {
              this.messages.push({severity:Constants.SUCCESS, summary:res['COMMON.SAVE'], detail:res['MESSAGE.SAVE_SUCCESS']});
            });
          }
          else {
            this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_UNSUCCESS']).subscribe(res => {
              this.messages.push({severity:Constants.SUCCESS, summary:res['COMMON.SAVE'], detail:res['MESSAGE.SAVE_UNSUCCESS']});
            });
          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }

 }
