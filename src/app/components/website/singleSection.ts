import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {GenericService} from '../../services';
import {Constants} from '../../app.constants';
import {GlobalEventsManager} from '../../services/globalEventsManager';
import { SectionItem } from '../../models/website';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'user-single-section',
  templateUrl: '../../pages/website/singleSection.html',
  providers: [Constants, GenericService]
})

// tslint:disable-next-line:component-class-suffix
export class SingleSection implements OnInit {

    sectionItems: SectionItem [] = [];

  constructor(
    private globalEventsManager: GlobalEventsManager,
    public translate: TranslateService,
    private genericService: GenericService,
    private route: ActivatedRoute) {
        this.globalEventsManager.showMenu = false;
        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            this.ngOnInit();
        });
  }

  ngOnInit() {

    this.route
      .queryParams
      .subscribe(params => {

            const sectionId = params['sectionId'];

            if (sectionId != null) {
                const parameters = [];
                parameters.push('e.section.language = |language|' + this.translate.currentLang + '|String');
                parameters.push('e.section.id = |sectionId|' + sectionId + '|Long');
                parameters.push('e.status = |status|0|Integer');
                parameters.push('e.section.status = |sectionStatus|0|Integer');
                this.genericService.getAllByCriteria('com.qkcare.model.website.SectionItem', parameters)
                .subscribe((data: SectionItem[]) => {
                    this.sectionItems = data;
            },
            error => console.log(error),
            () => console.log('Get all SectionItem complete'));
        } else {

        }
      });

  }

  setDefaults() {

  }
}
