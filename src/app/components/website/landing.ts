import { Component, OnInit, OnDestroy } from '@angular/core';
import { GenericService, GlobalEventsManager } from '../../services';
import { SectionItem, Section, SliderText } from '../../models/website';
import { Company } from '../../models/company';
import { Employee } from '../../models/employee';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-landing',
  templateUrl: '../../pages/website/landing.html',
  styleUrls: ['./landing.css'],
  providers: [GenericService]
})
// tslint:disable-next-line:component-class-suffix
export class Landing implements OnInit, OnDestroy {

    aboutUsSection: Section = new Section();
    serviceSection: Section = new Section();
    industrySection: Section = new Section();
    sliderTexts: SliderText[] = [];
    sectionMap: Map<string, SectionItem[]> = new Map();
    managers: Employee [] = [];
    company: Company = new Company();

    changeCarrousel = true;

    constructor
    (
      private genericService: GenericService,
      public globalEventsManager: GlobalEventsManager,
      public translate: TranslateService
    ) {

      this.loadData();
      this.globalEventsManager.showMenu = false;
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.loadData();
    });


  }

  ngOnInit(): void {
  }

  loadData(): void {
      this.sectionMap = new Map();
      this.sliderTexts[1] = new SliderText();
      this.sliderTexts[2] = new SliderText();
      this.sliderTexts[3] = new SliderText();
      this.sliderTexts[4] = new SliderText();

      let parameters: string [] = [];
      parameters.push('e.language = |language|' + this.translate.currentLang + '|String');
      this.genericService.getAllByCriteria('com.qkcare.model.website.SliderText', parameters)
          .subscribe((data: SliderText[]) => {
              let i = 1;
              for (const item of data) {
                 this.sliderTexts[i] = item;
                 i = i + 1;
              }
      },
      error => console.log(error),
      () => console.log('Get all SliderText complete'));

      parameters = [];
      parameters.push('e.status = |status|0|Integer');
      parameters.push('e.section.language = |language|' + this.translate.currentLang + '|String');
      this.genericService.getAllByCriteria('com.qkcare.model.website.SectionItem', parameters)
          .subscribe((data: SectionItem[]) => {
              for (const item of data) {
                if (!this.sectionMap.has(item.section.title)) {
                    this.sectionMap.set(item.section.title, []);
                }
                this.sectionMap.get(item.section.title).push(item);
              }

      },
      error => console.log(error),
      () => console.log('Get all SectionItem complete'));

      parameters = [];
    parameters.push('e.status = |status|0|Integer');
    parameters.push('e.language = |language|' + this.translate.currentLang + '|String');
    this.genericService.getAllByCriteria('Company', parameters)
        .subscribe((data: Company[]) => {
        if (data.length > 0) {
            this.company = data[0];
        } else {
            this.company = new Company();
        }
    },
    error => console.log(error),
    () => console.log('Get Company complete'));

      parameters = [];
      parameters.push('e.managing = |managing|0|Integer');
      parameters.push('e.status = |status|0|Integer');
      this.genericService.getAllByCriteria('Employee', parameters)
          .subscribe((data: Employee[]) => {
         if (data.length > 0) {
           this.managers = data;
         }
       },
       error => console.log(error),
       () => console.log('Get Managers complete'));
  }

  ngOnDestroy() {
        this.aboutUsSection = null;
        this.serviceSection = null;
        this.industrySection = null;
        this.sliderTexts = null;
        this.sectionMap = null;
        this.managers = null;
  }

 }
