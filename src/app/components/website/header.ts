import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericService, TokenStorage, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Company } from '../../models/company';
import { Section } from '../../models/website';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    selector: 'app-web-header',
    templateUrl: '../../pages/website/header.html',
    providers: [GenericService]
})
// tslint:disable-next-line:component-class-suffix
export class Header implements OnInit, OnDestroy {

    homeActive = 'active';
    sectionActives = [];
    industryActive = '';
    aboutActive = '';
    contactActive = '';
    loginActive = '';
    company: Company = new Company();
    menuSections: Section[] = [];

    constructor
        (
            public tokenStorage: TokenStorage,
            public globalEventsManager: GlobalEventsManager,
            private genericService: GenericService,
            public translate: TranslateService,
            private router: Router,
            private route: ActivatedRoute
        ) {

        this.setActiveTab();
        this.globalEventsManager.currentLang = translate.currentLang;
    }

    setActiveTab() {
        this.homeActive = '';
        this.sectionActives = [];
        this.industryActive = '';
        this.aboutActive = '';
        this.contactActive = '';

        if (this.router.url === '/') {
            this.homeActive = 'active';
        } else if (this.router.url.startsWith('/section')) {
            this.route
                .queryParams
                .subscribe(params => {
                    const sectionId = params['sectionId'];
                    this.sectionActives[sectionId] = 'active';
                });

        } else if (this.router.url === '/industries') {
            this.industryActive = 'active';
        } else if (this.router.url === '/about') {
            this.aboutActive = 'active';
        } else if (this.router.url === '/contact') {
            this.contactActive = 'active';
        } else if (this.router.url === '/login') {
            this.loginActive = 'active';
        }
    }

    ngOnInit(): void {
        const parameters = [];
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

        this.loadData();
        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            this.loadData();
        });

    }

    loadData() {
        const parameters: string[] = [];
        parameters.push('e.status = |status|0|Integer');
        parameters.push('e.showInMenu = |showInMenu|Y|String');
        parameters.push('e.language = |language|' + this.translate.currentLang + '|String');
        this.genericService.getAllByCriteria('com.qkcare.model.website.Section', parameters)
            .subscribe((data: Section[]) => {
                this.menuSections = data;
            },
                error => console.log(error),
                () => console.log('Get all SectionItem complete'));
    }

    ngOnDestroy() {
    }

    changeLanguage(selectLang: string) {
        this.globalEventsManager.currentLang = selectLang;
        this.translate.use(selectLang);
    }

    logOut() {
        this.tokenStorage.signOut();
        this.router.navigate(['/']);
        window.location.reload();
    }

    gotoDashboard() {
        this.globalEventsManager.showMenu = true;
        console.log('going to dashboard');
        this.router.navigate(['/admin/dashboard']);
        console.log('gone to dashboard');
        // window.location.reload();
        console.log('after reload to dashboard');
    }

}
