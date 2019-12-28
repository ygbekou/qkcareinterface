import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService, TokenStorage, UserService, GenericService } from '../../services';
import { Constants } from '../../app.constants';
import { User } from '../../models/user';
import { GlobalEventsManager } from '../../services/globalEventsManager';
import { Message } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'user-register-form',
	templateUrl: '../../pages/website/register.html',
	providers: [Constants]
})

// tslint:disable-next-line:component-class-suffix
export class Register implements OnInit {
	messages: Message[] = [];
	passwordSent = '';
	button = '';
	user: User;
	action: number;
	display = false;
	confirmPassword: string;

	constructor(
		private router: Router,
		private userService: UserService,
		private genericService: GenericService,
		private tokenStorage: TokenStorage,
		public translate: TranslateService,
		private authenticationService: AuthenticationService,
		private globalEventsManager: GlobalEventsManager,
		private route: ActivatedRoute) {
		this.user = new User();
		this.route.queryParams.subscribe(params => {
			this.action = params['action'];
			console.log('action =' + this.action);
		});

		this.globalEventsManager.showMenu = false;

	}

	ngOnInit() {
		this.user = new User();
		// this.setDefaults();
	}

	public login() {
		try { 
			this.messages = [];
			console.log(this.button);
			this.user.lang = this.translate.currentLang;
			if (this.button === 'validate') {
				this.userService.getTempUser(this.user)
					.subscribe(data => {
						if (data.id && data.id > 0) {
							//this is good
							this.user = data;
						} else {
							this.translate.get(['MESSAGE.NO_MATCHING_RECORD_FOUND', 'COMMON.ERROR']).subscribe(res => {
								this.messages.push({ severity: Constants.ERROR, summary: res['COMMON.ERROR'], detail: res['MESSAGE.NO_MATCHING_RECORD_FOUND'] });
							});
						}
					});
			} else {
				//console.log('e-mail=' + this.user.email);
				//console.log('password=' + this.user.password);
				if (!this.isEmail(this.user.email)) {
					this.translate.get(['VALIDATION.EMAIL_REQUIRED', 'COMMON.ERROR']).subscribe(res => {
						this.messages.push({ severity: Constants.ERROR, summary: res['COMMON.ERROR'], detail: res['VALIDATION.EMAIL_REQUIRED'] });
					});
				} else if (this.user.password === null || this.user.password === '') {
					this.translate.get(['VALIDATION.PASSWORD_REQUIRED', 'COMMON.ERROR']).subscribe(res => {
						this.messages.push({ severity: Constants.ERROR, summary: res['COMMON.ERROR'], detail: res['VALIDATION.PASSWORD_REQUIRED'] });
					});
				} else {
					this.userService.saveUserAndLogin(this.user)
						.subscribe(data => {
							if (this.tokenStorage.getToken() !== '' && this.tokenStorage.getToken() !== null) {
								console.log('Token = ' + this.tokenStorage.getToken());

								this.globalEventsManager.showMenu = true;
								console.log('Navigating to dashboard');
								this.router.navigate(['/admin/dashboard']);
								//window.location.reload();

							} else {
								console.log('No token');
								this.translate.get(['VALIDATION.EMAIL_USED', 'COMMON.ERROR']).subscribe(res => {
									this.messages.push({ severity: Constants.ERROR, summary: res['COMMON.ERROR'], detail: res['VALIDATION.EMAIL_USED'] });
								});
							}
						});
				}
			}
		} catch (e) {
			console.log('Exception...');
			this.translate.get(['MESSAGE.INVALID_USER_PASS', 'COMMON.ERROR']).subscribe(res => {
				this.messages.push({ severity: Constants.ERROR, summary: res['COMMON.ERROR'], detail: res['MESSAGE.INVALID_USER_PASS'] });
			});
		}


	}

	isEmail(search: string): boolean {
		let serchfind: boolean;
		// tslint:disable-next-line: max-line-length
		const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

		serchfind = regexp.test(search);
		console.log(serchfind);
		return serchfind;
	}
}
