import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SearchCriteria, User } from '../../models';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { Constants } from '../../app.constants';
import { BaseComponent } from '../admin/baseComponent';

@Component({
  selector: 'app-user-list',
  templateUrl: '../../pages/authorization/userList.html',
  providers: [GenericService]
})
export class UserList extends BaseComponent implements OnInit, OnDestroy {

  messages: Message[] = [];
  users: User[] = [];
  selectedUser: User = new User();
  @Output() selectedUserEmit: EventEmitter<User> = new EventEmitter<User>();
  cols: any[];
  searchCriteria: SearchCriteria = new SearchCriteria();
  originalPage = '';

  constructor
    (
      public genericService: GenericService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      public globalEventsManager: GlobalEventsManager,
      private route: ActivatedRoute,
      private router: Router,
  ) {
      super(genericService, translate, confirmationService, tokenStorage);
  }

  updateCols() {
    for (const index in this.cols) {
      const col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }

  generateCols() {
    this.cols = [
      {
        field: 'lastName', header: 'Last Name', headerKey: 'COMMON.LAST_NAME', type: 'user',
        style: { width: '20%', 'text-align': 'center' }
      },
      {
        field: 'firstName', header: 'First Name', headerKey: 'COMMON.FIRST_NAME', type: 'user',
        style: { width: '20%', 'text-align': 'center' }
      },
      {
        field: 'birthDate', header: 'Birth Date', headerKey: 'COMMON.BIRTH_DATE', type: 'date',
        style: { width: '20%', 'text-align': 'center' }
      },
      {
        field: 'email', header: 'Email', headerKey: 'COMMON.E_MAIL', type: 'user',
        style: { width: '20%', 'text-align': 'center' }
      },
      {
        field: 'sex', header: 'Sex', headerKey: 'COMMON.GENDER', type: 'user',
        style: { width: '5%', 'text-align': 'center' }
      }
    ];
  }

  ngOnInit(): void {

    this.generateCols();

    this.route
      .queryParams
      .subscribe(params => {

        this.originalPage = params['originalPage'];
      });

    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }


  ngOnDestroy() {
    this.users = null;
  }

  redirectToOrigialPage(user: User) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'userId': user.id,
          'userName': user.name,
          'birthDate': user.birthDate,
          'gender': user.sex,
        }
      };
      this.router.navigate([this.originalPage], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

  clear() {
    this.messages = [];
    this.selectedUser = new User();
  }

  selectUser(userId: number) {
    
    this.clear();

    this.genericService.getNewObject('/service/authorization/user/get/', userId)
        .subscribe(result => {
      if (result.id > 0) {
       
        this.selectedUser = result;
        this.selectedUser.birthDate = new Date(this.selectedUser.birthDate);
        this.selectedUserEmit.emit(this.selectedUser);

      }
    });
  }


  search() {

    const parameters: string[] = [];
    this.messages = [];

    parameters.push('e.status = |status|0|Integer');
    if (this.searchCriteria.lastName != null && this.searchCriteria.lastName.length > 0) {
      parameters.push('e.lastName like |lastName|' + '%' + this.searchCriteria.lastName + '%' + '|String');
    }
    if (this.searchCriteria.firstName != null && this.searchCriteria.firstName.length > 0) {
      parameters.push('e.firstName like |firstName|' + '%' + this.searchCriteria.firstName + '%' + '|String');
    }
    if (this.searchCriteria.birthDate != null) {
      parameters.push('e.birthDate = |birthDate|' +
        this.searchCriteria.birthDate.toLocaleDateString(this.globalEventsManager.LOCALE,
          Constants.LOCAL_DATE_OPTIONS) + '|Date');
    }

    if (parameters.length === 1) {
      this.translate.get(['MESSAGE.NO_CRITERIA_SET', 'COMMON.SEARCH']).subscribe(res => {
        this.messages.push({
          severity: Constants.ERROR, summary: res['COMMON.SEARCH'],
          detail: res['MESSAGE.NO_CRITERIA_SET']
        });
      });
      this.users = [];
      return false;
    }

    this.genericService.getAllByCriteria('User', parameters)
      .subscribe((data: User[]) => {
        this.users = data;
      },
        error => console.log(error),
        () => console.log('Get all Users complete'));
  }

}
