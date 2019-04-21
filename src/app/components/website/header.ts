import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericService, TokenStorage, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Company } from '../../models/company';
import { Section } from '../../models/website';

@Component({
  selector: 'app-web-header',
  template: `
            <header id="header" class="header-effect-shrink" data-plugin-options="{'stickyEnabled': true, 'stickyEffect': 'shrink',
            'stickyEnableOnBoxed': true, 'stickyEnableOnMobile': true, 'stickyChangeLogo': true, 'stickyStartAt': 120,
            'stickyHeaderContainerHeight': 70}">
				<div class="header-body border-color-primary header-body-bottom-border">
					<div class="header-top header-top-default border-bottom-0">
						<div class="container">
							<div class="header-row py-2">
								<div class="header-column justify-content-start">
									<div class="header-row">
										<nav class="header-nav-top">
											<ul class="nav nav-pills text-uppercase text-2">
												<li class="nav-item nav-item-anim-icon d-none d-md-block">
                                                    <a class="nav-link pl-0" href="#/about">
                                                    <i class="fas fa-angle-right"></i> {{ 'COMMON.ABOUT_US' | translate }}</a>
												</li>
												<li class="nav-item nav-item-anim-icon d-none d-md-block">
                                                    <a class="nav-link" href="#/contact">
                                                    <i class="fas fa-angle-right"></i> {{ 'COMMON.CONTACT_US' | translate }}</a>
												</li>
											</ul>
										</nav>
									</div>
                                </div>
                                <div class="header-column justify-content-end">
                                    <div class="header-row">
                                        <nav class="header-nav-top">
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <p-radioButton name="language" value="en" label="EN"
                                                [(ngModel)]="globalEventsManager.currentLang" #langSelect="ngModel"
                                            (click)="globalEventsManager.changeLanguage('en')">
                                            </p-radioButton>&nbsp;&nbsp;&nbsp;&nbsp;

                                            <p-radioButton name="language" value="fr" label="FR"
                                            [(ngModel)]="globalEventsManager.currentLang" #langSelect="ngModel"
                                            (click)="globalEventsManager.changeLanguage('fr')">
                                            </p-radioButton>

										</nav>
									</div>
                                </div>
								<div class="header-column justify-content-end">
									<div class="header-row">
										<nav class="header-nav-top">
											<ul class="nav nav-pills">
												<li class="nav-item">
													<a href="mailto:{{company.email}}"><i class="far fa-envelope text-4
                                                    text-color-primary" style="top: 1px;"></i> {{company.email}}</a>
												</li>
												<li class="nav-item">
                                                    <a href="tel:{{company.phone}}"><i class="fab fa-whatsapp text-4
                                                    text-color-primary" style="top: 0;"></i> {{company.phone}}</a>
												</li>
											</ul>
										</nav>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="header-container container">
						<div class="header-row">
							<div class="header-column">
								<div class="header-row">
									<div class="header-logo">
										<a href="index.html">
											<img alt="ATC" width="200" height="96" src="assets/docs/Company/{{company.logo}}">
										</a>
									</div>
								</div>
							</div>
							<div class="header-column justify-content-end">
								<div class="header-row">
									<div class="header-nav header-nav-links order-2 order-lg-1">
										<div class="header-nav-main header-nav-main-square header-nav-main-effect-2 header-nav-main-sub-effect-1">
											<nav class="collapse">
												<ul class="nav nav-pills" id="mainNav">
													<li class="dropdown">
														<a class="dropdown-item dropdown-toggle {{homeActive}}" href="/">
															{{ 'COMMON.HOME' | translate }}
														</a>
													</li>
													<li class="dropdown" *ngFor="let menuSection of menuSections">
														<a class="dropdown-item dropdown-toggle {{sectionActives[menuSection.id]}}" href="#/section?sectionId={{menuSection.id}}">
															{{ menuSection.name }}
														</a>
													</li>
													<li class="dropdown">
														<a class="dropdown-item dropdown-toggle {{aboutActive}}" href="#/about">
															{{ 'COMMON.ABOUT_US' | translate }}
														</a>
													</li>
													<li class="dropdown">
														<a class="dropdown-item dropdown-toggle {{contactActive}}" href="#/contact">
															{{ 'COMMON.CONTACT_US' | translate }}
														</a>
                                                    </li>
                                                    <li class="dropdown" *ngIf="!tokenStorage.hasToken()">
                                                        <a class="dropdown-item dropdown-toggle {{loginActive}}" href="#/login">
                                                            {{ 'COMMON.LOGIN' | translate }}
                                                        </a>
                                                    </li>
                                                    <li class="dropdown" *ngIf="tokenStorage.hasToken()">
                                                        <a class="dropdown-item dropdown-toggle" (click)="logOut()">
                                                            {{ 'COMMON.LOGOUT' | translate }}
                                                        </a>
                                                    </li>
                                                    <li class="dropdown" *ngIf="tokenStorage.hasToken()">
                                                        <a class="dropdown-item dropdown-toggle" href="#/adminWebsite">
                                                            {{ 'COMMON.ADMIN_PAGE' | translate }}
                                                        </a>
                                                    </li>
												</ul>
											</nav>
										</div>
										<ul class="header-social-icons social-icons d-none d-sm-block">
                                            <li class="social-icons-facebook"><a href="{{company.facebookUrl}}"
                                             target="_blank"
                                                title="Facebook"><i class="fab fa-facebook-f"></i></a></li>
                                            <li class="social-icons-twitter"><a href="{{company.twitterUrl}}"
                                            target="_blank"
                                                title="Twitter"><i class="fab fa-twitter"></i></a></li>
                                            <li class="social-icons-linkedin"><a href="{{company.linkedInUrl}}"
                                            target="_blank"
                                                title="Linkedin"><i class="fab fa-linkedin-in"></i></a></li>										</ul>
										<button class="btn header-btn-collapse-nav" data-toggle="collapse" data-target=".header-nav-main nav">
											<i class="fas fa-bars"></i>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>

  `,
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
      const parameters: string [] = [];
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
        this.router.navigate(['login']);
    }

 }
