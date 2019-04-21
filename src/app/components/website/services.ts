import {Component, OnInit} from '@angular/core';
import {GenericService} from '../../services';
import {Constants} from '../../app.constants';
import {GlobalEventsManager} from '../../services/globalEventsManager';
import { SectionItem } from '../../models/website';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'user-services-form',
  templateUrl: '../../pages/website/services.html',
  providers: [Constants, GenericService]
})

// tslint:disable-next-line:component-class-suffix
export class Services implements OnInit {

    serviceItems: SectionItem [] = [];

  constructor(
    private globalEventsManager: GlobalEventsManager,
    public translate: TranslateService,
    private genericService: GenericService) {
        this.globalEventsManager.showMenu = false;
        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            this.ngOnInit();
        });
  }

  ngOnInit() {
    const parameters = [];
    parameters.push('e.section.name = |name|SERVICES|String');
    parameters.push('e.section.language = |language|' + this.translate.currentLang + '|String');
    this.genericService.getAllByCriteria('com.qkcare.model.website.SectionItem', parameters)
         .subscribe((data: SectionItem[]) => {
        this.serviceItems = data;
        // tslint:disable-next-line:no-console
        console.info(this.serviceItems);
    },
    error => console.log(error),
    () => console.log('Get all SectionItem complete'));
  }

  setDefaults() {

  }
}
