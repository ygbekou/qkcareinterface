import {Component, OnInit } from '@angular/core';
import {GenericService} from '../../services';
import {Constants} from '../../app.constants';
import {GlobalEventsManager} from '../../services/globalEventsManager';
import { Company } from '../../models/company';
import { Message } from 'primeng/api';
import { ContactUsMessage } from '../../models/website';
import { TranslateService } from '@ngx-translate/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'user-contact-form',
  templateUrl: '../../pages/website/contact.html',
  providers: [Constants, GenericService]
})

// tslint:disable-next-line:component-class-suffix
export class Contact implements OnInit {

    company: Company = new Company;
    contactUsMessage: ContactUsMessage = new ContactUsMessage();
    messages: Message[] = [];

  constructor(
    private globalEventsManager: GlobalEventsManager,
    public translate: TranslateService,
    private genericService: GenericService) {
        this.globalEventsManager.showMenu = false;
  }

  ngOnInit() {
    const parameters = [];
    this.genericService.getAllByCriteria('Company', parameters)
         .subscribe((data: Company[]) => {

            this.company = data[0];
    },
    error => console.log(error),
    () => console.log('Get Company complete'));
  }

  save(f: any) {
        this.messages = [];
        try {
            this.genericService.saveContactUsMessage(this.contactUsMessage)
            .subscribe(result => {
                if (result.id > 0) {
                    f.submitted = false;
                    this.contactUsMessage = new ContactUsMessage();
                    this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_SUCCESS']).subscribe(res => {
                        this.messages.push({severity: Constants.SUCCESS, summary: res['COMMON.SAVE'], detail: res['MESSAGE.SAVE_SUCCESS']});
                    });
                } else {
                    this.translate.get(['COMMON.SAVE', 'MESSAGE.UNSAVE_SUCCESS']).subscribe(res => {
                        this.messages.push({severity: Constants.ERROR, summary: res['COMMON.SAVE'], detail: res['MESSAGE.UNSAVE_SUCCESS']});
                    });
                }
            });
        } catch (e) {
        console.log(e);
        }
  }


  setDefaults() {

  }
}
