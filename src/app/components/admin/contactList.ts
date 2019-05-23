import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import {  } from 'primeng/primeng';
import { GenericService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { ContactUsMessage } from '../../models/website';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService, Message} from 'primeng/api';
import { Constants } from '../../app.constants';
import { GenericResponse } from '../../models/genericResponse';

@Component({
  selector: 'app-contact-list',
  templateUrl: '../../pages/admin/contactList.html',
  providers: [GenericService, ConfirmationService]
})
// tslint:disable-next-line:component-class-suffix
export class ContactList implements OnInit, OnDestroy {

  contactUsMessages: ContactUsMessage[] = [];
  cols: any[];
  @Output() contactUsMessageIdEvent = new EventEmitter<string>();
  messages: Message[] = [];

  constructor
    (
        private genericService: GenericService,
        private translate: TranslateService,
        private confirmationService: ConfirmationService,
        private router: Router,
    ) {

      this.getAll();

  }

  updateCols() {
    // tslint:disable-next-line:forin
    for (const index in this.cols) {
      const col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }

  getAll() {
     const parameters: string [] = [];
      this.genericService.getAllByCriteria('ContactUsMessage', parameters)
          .subscribe((data: ContactUsMessage[]) => {
        this.contactUsMessages = data;
      },
      error => {
          console.log(error);
          throw error;
      },
      () => console.log('Get all ContactUsMessage complete'));
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'createDate', header: 'Date', headerKey: 'COMMON.DATE', type: 'Date' },
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME'},
            { field: 'email', header: 'Email', headerKey: 'COMMON.FROM_EMAIL'},
            { field: 'phone', header: 'Phone', headerKey: 'COMMON.PHONE' } 
        ];

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.updateCols();
    });
  }


  ngOnDestroy() {
    this.contactUsMessages = null;
  }

  edit(contactUsMessageId: number) {
      this.contactUsMessageIdEvent.emit(contactUsMessageId + '');
  }

  delete(contactId: number) {
        this.messages = [];
        let confirmMessage = '';
        this.translate.get(['', 'MESSAGE.DELETE_CONFIRM']).subscribe(res => {
                          confirmMessage = res['MESSAGE.DELETE_CONFIRM'];
                      });

        this.confirmationService.confirm({
            message: confirmMessage,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.genericService.delete(contactId, 'ContactUsMessage')
                    .subscribe((response: GenericResponse) => {
                    if ('SUCCESS' === response.result) {
                        this.translate.get(['', 'MESSAGE.DELETE_SUCCESS']).subscribe(res => {
                            this.messages.push({severity: Constants.SUCCESS, summary:  res['COMMON.DELETE'],
                                detail: res['MESSAGE.DELETE_SUCCESS']});
                      });
                      this.getAll();
                    } else if ('FAILURE' === response.result) {
                        this.translate.get(['', 'MESSAGE.DELETE_UNSUCCESS']).subscribe(res => {
                            this.messages.push({severity: Constants.ERROR, summary:  res['COMMON.DELETE'],
                                detail: res['MESSAGE.DELETE_UNSUCCESS']});
                            });
                    }
                });
            },
            reject: () => {
            }
        });

    }

 }
