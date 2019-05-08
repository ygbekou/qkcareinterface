import { Component, OnInit, OnDestroy } from '@angular/core';
import { GenericService, GlobalEventsManager } from '../../services';
import { SectionItem, Section, SliderText } from '../../models/website';
import { Company } from '../../models/company';
import { Employee } from '../../models/employee';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';

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
  sliderTexts: SliderText[] = [new SliderText(), new SliderText(), new SliderText(), new SliderText()];
  sectionMap: Map<string, SectionItem[]> = new Map();
  managers: Employee[] = [];
  company: Company = new Company();

  changeCarrousel = true;

  constructor
    (
      private genericService: GenericService,
      public globalEventsManager: GlobalEventsManager,
      public translate: TranslateService
    ) {
    let lang = navigator.language;
    if (lang) {
      lang = lang.substring(0, 2);
    }
    if (Cookie.get('lang')) {
      this.translate.use(Cookie.get('lang'));
      console.log('Using cookie lang=' + Cookie.get('lang'));
    } else if (lang) {
      console.log('Using browser lang=' + lang);
      this.translate.use(lang);
    } else {
      this.translate.use('fr');
      console.log('Using default lang=fr');
    }

    this.loadData();
    this.globalEventsManager.showMenu = false;
    /*
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      //this.loadData();
    });
    */

  }

  ngOnInit(): void {
  }

  loadData(): void {
    console.log('****************************Loading data ***********');
    this.sectionMap = new Map();
    this.sliderTexts = [new SliderText(), new SliderText(), new SliderText(), new SliderText()];


    let parameters: string[] = [];
    parameters.push('e.language = |language|' + this.translate.currentLang + '|String');
    this.genericService.getAllByCriteria('com.qkcare.model.website.SliderText', parameters)
      .subscribe((data: SliderText[]) => {
        let i = 0;
        if (this.sliderTexts == null) {
          return;
        }
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
        //console.log(data);
        let i = 0;
        if (this.sectionMap == null) {
          return;
        }
        for (const item of data) {
          //console.log(item);
          if (!this.sectionMap.has(item.section.title)) {
            this.sectionMap.set(item.section.title, []);
          }
          console.log('Pushing: -->' + i++ + ' -->' + item.description);
          this.sectionMap.get(item.section.title).push(item);
        }
        //console.log(this.sectionMap);
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
