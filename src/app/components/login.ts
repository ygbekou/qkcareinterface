import {Component, OnInit, Output, EventEmitter, NgZone} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {AuthenticationService, TokenStorage, UserService} from '../services';
import {Constants} from '../app.constants';
import {User} from '../models/user';
import {Country} from '../models/country';
import { UserGroup } from '../models/userGroup';
import {GlobalEventsManager} from '../services/globalEventsManager';
import {CountryDropdown} from './dropdowns/dropdown.country';
import {Message } from 'primeng/primeng';
import { Patient } from '../models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'user-login-form',
  templateUrl: '../pages/login.html',
  providers: [Constants, CountryDropdown]
})

// tslint:disable-next-line:component-class-suffix
export class Login implements OnInit {
  error = '';
  passwordSent = '';
  button = '';
  user: User;
  action: number;
  msgs: Message[] = [];
  don: string;
  I_AM_MEMBER: string = Constants.I_AM_MEMBER;
  I_AM_SUBSCRIBE: string = Constants.I_AM_SUBSCRIBE;
  SEND_ME_MY_PASSWORD: string = Constants.SEND_ME_MY_PASSWORD;
  MALE: string = Constants.MALE;
  FEMALE: string = Constants.FEMALE;
  COUNTRY_RESIDENCE: string = Constants.COUNTRY_RESIDENCE;
  SAVE_LABEL: string = Constants.SAVE_LABEL;
  COUNTRY_ORIGIN: string = Constants.COUNTRY_ORIGIN;
  public countryDropdown: CountryDropdown;

  constructor(
    private router: Router,
    private userService: UserService,
    private tokenStorage: TokenStorage,
    private authenticationService: AuthenticationService,
    private globalEventsManager: GlobalEventsManager,
    private cDropdown: CountryDropdown,
    private route: ActivatedRoute) {
    this.user = new User();
    this.countryDropdown = cDropdown;
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
    console.log('Set defaults called.' + this.countryDropdown.countries.length);
    const orig = new Country();
    orig.id = 215;
    orig.name = 'Togo';
    const res = new Country();
    res.id = 64;
    res.name = 'Etats Unis';
  }

  public login() {
    try {
      this.error = '';
      this.passwordSent = '';
      console.log(this.button);
      if (this.button === 'password') {
        console.log('Send password called');
        this.sendPassword();

      } else {
        this.authenticationService.attemptAuth(this.user)
          .subscribe(data => {
            if (this.tokenStorage.getToken() !== '') {
              this.router.navigate(['/dashboard']);
            } else {
              this.error = Constants.INVALID_USER_PASS;
            }
          });
      }
    } catch (e) {
      this.error = Constants.ERROR_OCCURRED;
    }


  }

  public sendPassword() {
    try {
      this.button = '';
      this.userService.sendPassword(this.user)
        .subscribe(result => {
          if (result === true) {
            this.passwordSent = Constants.PASSWORD_SENT + this.user.email;
          } else {
            this.error = Constants.PASSWORD_NOT_SENT;
          }
        });
    } catch (e) {
      this.error = Constants.ERROR_OCCURRED;
    }

  }

  public saveUser() {
    this.error = '';
    if (this.user.firstName == null || this.user.lastName == null || this.user.email == null ||
      this.user.password == null ) {
      this.error = Constants.MISSING_REQUIRED_FIELD;
    } else {
      try {
        const patient: Patient = new Patient();
        const userGroup: UserGroup = new UserGroup();
        userGroup.id = 1;
        const user = new User();
        user.userGroup = userGroup;

        patient.user = user;

        this.userService.saveUserWithoutPicture('Patient', patient)
          .subscribe(result => {

            if (result == null) {
              this.user = JSON.parse(Cookie.get('user'));
              // this.globalEventsManager.showNavBar.emit(this.user);
              // window.location.reload();
            } else {
              this.user = result.user;
              this.error = '';
            }
          });
      } catch (e) {
        this.error = Constants.ERROR_OCCURRED;
      }
    }

  }

}
