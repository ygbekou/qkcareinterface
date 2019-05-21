import {Component} from '@angular/core';
import { Constants } from '../../app.constants';
import { TranslateService} from '@ngx-translate/core';


@Component({
  providers: []
})
export class BaseComponent {

  constructor
    (
    private translate1: TranslateService
    ) {

  }

  protected processResult(result, entityObject, messages, pictureUrl) {
    if (result.errors === null || result.errors.length === 0) {
        entityObject = result;
        this.translate1.get(['COMMON.SAVE', 'MESSAGE.SAVE_SUCCESS']).subscribe(res => {
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
        this.translate1.get(['COMMON.SAVE', 'MESSAGE.SAVE_UNSUCCESS']).subscribe(res => {
            messages.push({
                severity: Constants.ERROR, summary: res['COMMON.SAVE'],
                detail: res['MESSAGE.SAVE_UNSUCCESS'] + result.errors[0]
            });
        });
    }
  }

 }
