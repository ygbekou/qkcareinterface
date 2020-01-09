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
	selector: 'user-login-form',
	templateUrl: '../../pages/website/login.html',
	providers: [Constants]
})

// tslint:disable-next-line:component-class-suffix
export class Login implements OnInit {
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

	setDefaults() {
	}

	popup() {
		this.display = true;
	}

	public login() {
		try {
			this.messages = [];
			this.passwordSent = '';
			console.log(this.button);
			this.user.lang = this.translate.currentLang;
			if (this.button === 'password') {
				console.log('Send password called');
				this.sendPassword();
				this.button = '';
			} if (this.button === 'register') {
				console.log('register called');
				this.router.navigate(['/register']);
			} else {
				this.authenticationService.attemptAuth(this.user)
					.subscribe(data => {
						if (data.firstTimeLogin === 'Y') {
							this.user.password = '';
							this.display = true;
							//this.userService.changeToken(data.token);
							console.log('first time login');
						} else {
							if (this.tokenStorage.getToken() !== '' && this.tokenStorage.getToken() !== null) {
								console.log('redirecting to dashboard');
								this.globalEventsManager.showMenu = true;
								console.log('Navigating to dashboard');
								this.genericService.updateToken();
								this.router.navigate(['/admin/pdashboard']);
								//window.location.reload();
							} else {
								console.log('No token');
								this.translate.get(['MESSAGE.INVALID_USER_PASS', 'COMMON.ERROR']).subscribe(res => {
									this.messages.push({ severity: Constants.ERROR, summary: res['COMMON.ERROR'], detail: res['MESSAGE.INVALID_USER_PASS'] });
								});
							}
						}


					});
			}
		} catch (e) {
			console.log('Exception...');
			this.translate.get(['MESSAGE.INVALID_USER_PASS', 'COMMON.ERROR']).subscribe(res => {
				this.messages.push({ severity: Constants.ERROR, summary: res['COMMON.ERROR'], detail: res['MESSAGE.INVALID_USER_PASS'] });
			});
		}


	}

	public sendPassword() {
		try {
			if (this.user.userName === null) {
				this.translate.get(['MESSAGE.PASSWORD_NOT_SENT', 'COMMON.ERROR']).subscribe(res => {
					this.messages.push({
						severity: Constants.ERROR, summary: res['COMMON.ERROR'],
						detail: res['MESSAGE.PASSWORD_NOT_SENT']
					});
				});
			} else {
				this.userService.sendPassword(this.user)
					.subscribe(result => {
						if (result === true) {
							this.translate.get(['MESSAGE.PASSWORD_SENT', 'COMMON.SUCCESS']).subscribe(res => {
								this.messages.push({
									severity: Constants.SUCCESS, summary: res['COMMON.SUCCESS'],
									detail: res['MESSAGE.PASSWORD_SENT']
								});
							});
						} else {
							this.translate.get(['MESSAGE.PASSWORD_NOT_SENT', 'COMMON.ERROR']).subscribe(res => {
								this.messages.push({
									severity: Constants.ERROR, summary: res['COMMON.ERROR'],
									detail: res['MESSAGE.PASSWORD_NOT_SENT']
								});
							});
						}
					});
			}
		} catch (e) {
			this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
				this.messages.push({
					severity: Constants.ERROR, summary: res['COMMON.ERROR'],
					detail: res['MESSAGE.ERROR_OCCURRED']
				});
			});
		}

	}


	public changePassword() {
		try {
			this.messages = [];
			if (this.user.confirmPassword !== this.user.password) {
				this.translate.get(['MESSAGE.PASSWORD_NOT_MATCHED', 'COMMON.ERROR']).subscribe(res => {
					this.messages.push({
						severity: Constants.ERROR, summary: res['COMMON.ERROR'],
						detail: res['MESSAGE.PASSWORD_NOT_MATCHED']
					});
				});
				return;
			}
			this.userService.changePassword(this.user)
				.subscribe(result => {
					if (result) {
						this.translate.get(['MESSAGE.PASSWORD_CHANGED', 'COMMON.SUCCESS']).subscribe(res => {
							this.messages.push({
								severity: Constants.SUCCESS, summary: res['COMMON.SUCCESS'],
								detail: res['MESSAGE.PASSWORD_CHANGED']
							});
						});
						this.display = false;
					} else {
						this.translate.get(['MESSAGE.PASSWORD_NOT_CHANGED', 'COMMON.ERROR']).subscribe(res => {
							this.messages.push({
								severity: Constants.ERROR, summary: res['COMMON.ERROR'],
								detail: res['MESSAGE.PASSWORD_NOT_CHANGED']
							});
						});
					}
				});
		} catch (e) {
			this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
				this.messages.push({
					severity: Constants.ERROR, summary: res['COMMON.ERROR'],
					detail: res['MESSAGE.ERROR_OCCURRED']
				});
			});
		}

	}

	closePasswordUpdateDialog() {
		//this.router.navigate(['/admin/dashboard']);
		//window.location.reload();
		this.display = false;
	}

}
