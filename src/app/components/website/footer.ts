import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericService, GlobalEventsManager } from '../../services';
import { Company } from '../../models/company';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-web-footer',
  template: `
			<footer id="footer">
				<div class="container">
					<div class="footer-ribbon">
						<span>{{ 'COMMON.CONTACT_US' | translate }}</span>
					</div>
					<div class="row py-5 my-4">

						<div class="col-md-6 col-lg-3 mb-4 mb-md-0">
							<div class="contact-details">
								<h5 class="text-3 mb-3">{{ 'COMMON.CONTACT_US' | translate }}</h5>
								<ul class="list list-icons list-icons-lg">
                                    <li class="mb-1"><i class="far fa-dot-circle text-color-primary"></i>
                                        <p class="m-0">{{company.address}}</p></li>
                                    <li class="mb-1"><i class="fab fa-whatsapp text-color-primary"></i>
                                        <p class="m-0"><a href="tel:{{company.phone}}">
                                            {{company.phone}}</a></p>
                                        <p class="m-0"><a href="tel:{{company.phone2}}">
                                            {{company.phone2}}</a></p>
                                    </li>
                                    <li class="mb-1"><i class="fas fa-fax text-color-primary"></i>
                                        <p class="m-0"><a>{{company.phone}}</a></p>
                                    </li>
                                    <li class="mb-1"><i class="far fa-envelope text-color-primary"></i>
                                        <p class="m-0">
                                        <a href="mailto:{{company.email}}">{{company.email}}</a></p>
                                    </li>
								</ul>
							</div>
						</div>
						<div class="col-md-6 col-lg-2">
							<h5 class="text-3 mb-3">{{ 'COMMON.FOLLOW_US' | translate }}</h5>
							<ul class="social-icons">
                                <li class="social-icons-facebook"><a href="{{company.facebookUrl}}"
                                target="_blank" title="Facebook">
                                        <i class="fab fa-facebook-f"></i></a></li>
                                <li class="social-icons-twitter"><a href="{{company.twitterUrl}}"
                                target="_blank" title="Twitter">
                                        <i class="fab fa-twitter"></i></a></li>
                                <li class="social-icons-linkedin"><a href="{{company.linkedInUrl}}"
                                target="_blank" title="Linkedin">
                                        <i class="fab fa-linkedin-in"></i></a></li>
							</ul>
						</div>
					</div>
				</div>
				<div class="footer-copyright">
					<div class="container py-2">
						<div class="row py-4">
							<div class="col-lg-7 d-flex align-items-center justify-content-center justify-content-lg-start mb-4 mb-lg-0">
								<p>{{company.copyright}}</p>
							</div>
						</div>
					</div>
				</div>
			</footer>
  `,
  providers: [GenericService]
})
// tslint:disable-next-line:component-class-suffix
export class Footer implements OnInit, OnDestroy {

    company: Company = new Company();

    constructor
    (
       public globalEventsManager: GlobalEventsManager,
       private genericService: GenericService,
       public translate: TranslateService
    ) {


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
  }

  ngOnDestroy() {
  }

 }
