import {Component} from '@angular/core';
import { Constants } from '../../app.constants';
import { TranslateService} from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { GenericService } from 'src/app/services';
import { GenericResponse } from 'src/app/models/genericResponse';


@Component({
  providers: []
})
export class BaseComponent {

   public messages: Message[] = [];

  constructor
    (
		public genericService: GenericService,
		public translate: TranslateService,
		public confirmationService: ConfirmationService,
    ) {

  }

  protected processResult(result, entityObject, messages, pictureUrl) {
    if (result.errors === null || result.errors.length === 0) {
        entityObject = result;
        this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_SUCCESS']).subscribe(res => {
            messages.push({
                severity: Constants.SUCCESS, summary: res['COMMON.SAVE'],
                detail: res['MESSAGE.SAVE_SUCCESS']
            });
        });
        
        if (entityObject.user && entityObject.user.birthDate != null) {
            entityObject.user.birthDate = new Date(entityObject.user.birthDate);
        }
        if (pictureUrl) {
            pictureUrl = '';
		}
    } else {
        this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_UNSUCCESS']).subscribe(res => {
            messages.push({
                severity: Constants.ERROR, summary: res['COMMON.SAVE'],
                detail: res['MESSAGE.SAVE_UNSUCCESS'] + result.errors[0]
            });
        });
    }
  }


  deleteItem(listItems: any[], id: string, entity: string) {
	  	if (id === undefined || id === null) {
			this.removeItem(listItems, +id);
			return;
		}

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
                this.genericService.delete(+id, entity)
                    .subscribe((response: GenericResponse) => {
                        if ('SUCCESS' === response.result) {
                            this.translate.get(['COMMON.DELETE', 'MESSAGE.DELETE_SUCCESS']).subscribe(res => {
                                this.messages.push({
                                    severity: Constants.SUCCESS, summary: res['COMMON.DELETE'],
                                    detail: res['MESSAGE.DELETE_SUCCESS']
                                });
                            });
                            this.removeItem(listItems, +id)
                        } else if ('FOREIGN_KEY_FAILURE' === response.result) {
                            this.translate.get(['COMMON.DELETE', 'MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY']).subscribe(res => {
                                this.messages.push({
                                    severity: Constants.ERROR, summary: res['COMMON.DELETE'],
                                    detail: res['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY'] + '<br/>' + response.message
                                });
                            });
						} else if ('GENERIC_FAILURE' === response.result) {
							alert('Here')
                            this.translate.get(['COMMON.DELETE', 'MESSAGE.DELETE_UNSUCCESS']).subscribe(res => {
                                this.messages.push({
                                    severity: Constants.ERROR, summary: res['COMMON.DELETE'],
									detail: res['MESSAGE.DELETE_UNSUCCESS'] + '<br/>' + response.message
                                });
                            });
                        }
                    });
            },
            reject: () => {
            }
        });

	}
	
  removeItem(listItems: any[], id: number) {

	let index = listItems.findIndex(x => x.id === id);
	listItems.splice(index, 1)

  }





 }
