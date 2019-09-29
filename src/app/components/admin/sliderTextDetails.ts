import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SliderText } from '../../models/website';
import { Constants } from '../../app.constants';
import { SliderDropdown } from '../dropdowns';
import { GenericService, TokenStorage } from '../../services';
import { TranslateService} from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-sliderText-details',
  templateUrl: '../../pages/admin/sliderTextDetails.html',
  providers: [GenericService, SliderDropdown]

})
// tslint:disable-next-line:component-class-suffix
export class SliderTextDetails extends BaseComponent implements OnInit, OnDestroy {

    sliderText: SliderText = new SliderText();
    messages: Message[] = [];


    constructor
    (
      public genericService: GenericService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      public  sliderDropdown: SliderDropdown
    ) {
      super(genericService, translate, confirmationService, tokenStorage);
      this.sliderText = new SliderText();
  }



  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.sliderText = null;
  }

  getSliderText(slierTextId: number) {
    this.messages = [];
    this.genericService.getOne(slierTextId, 'com.qkcare.model.website.SliderText')
        .subscribe(result => {
      if (result.id > 0) {
        this.sliderText = result;
      } else {
        this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
          this.messages.push({severity: Constants.ERROR, summary: res['COMMON.READ'], detail: res['MESSAGE.READ_FAILED']});
        });
      }
    });
  }

  clear() {
    this.sliderText = new SliderText();
  }

  save() {

    try {

        this.genericService.save(this.sliderText, 'com.qkcare.model.website.SliderText')
            .subscribe(result => {
            if (result.id > 0) {
              this.sliderText = result;
              this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_SUCCESS']).subscribe(res => {
                this.messages.push({severity: Constants.SUCCESS, summary: res['COMMON.SAVE'], detail: res['MESSAGE.SAVE_SUCCESS']});
                });
            } else {
              this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_UNSUCCESS']).subscribe(res => {
                this.messages.push({severity: Constants.SUCCESS, summary: res['COMMON.SAVE'], detail: res['MESSAGE.SAVE_SUCCESS']});
                });
            }
            });
        } catch (e) {
            console.log(e);
        }
  }


  delete() {

  }

 }
