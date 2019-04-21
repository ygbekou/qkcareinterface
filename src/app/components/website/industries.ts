import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {GenericService} from '../../services';
import {Constants} from '../../app.constants';
import {GlobalEventsManager} from '../../services/globalEventsManager';
import { SectionItem } from '../../models/website';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'user-industries-form',
  templateUrl: '../../pages/website/industries.html',
  providers: [Constants, GenericService]
})

// tslint:disable-next-line:component-class-suffix
export class Industries implements OnInit {

    industryItems: SectionItem [] = [];

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
    parameters.push('e.section.name = |name|INDUSTRIES|String');
    parameters.push('e.section.language = |language|' + this.translate.currentLang + '|String');
    this.genericService.getAllByCriteria('com.qkcare.model.website.SectionItem', parameters)
         .subscribe((data: SectionItem[]) => {
        this.industryItems = data;
        // tslint:disable-next-line:no-console
        console.info(this.industryItems);
    },
    error => console.log(error),
    () => console.log('Get all SectionItem complete'));
  }

  setDefaults() {

  }
}
