import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Role } from '../../models';
import { ConfirmationService } from 'primeng/primeng';
import { GenericService, TokenStorage } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../admin/baseComponent';

@Component({
  selector: 'app-role-list',
  templateUrl: '../../pages/authorization/roleList.html',
  providers: [GenericService]
})
export class RoleList extends BaseComponent implements OnInit, OnDestroy {

  roles: Role[] = [];
  cols: any[];

  @Output() roleIdEvent = new EventEmitter<string>();

  constructor
    (
      public genericService: GenericService,
	    public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      private route: ActivatedRoute,
      private router: Router,
  ) {
	  super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'Name', headerKey: 'COMMON.NAME', style: {width: '30%', 'text-align': 'center'} },
      { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION', style: {width: '50%', 'text-align': 'center'} },
      { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS', style: {width: '10%', 'text-align': 'center'} }
    ];

    this.route
      .queryParams
      .subscribe(() => {

        this.genericService.getAll('com.qkcare.model.authorization.Role')
          .subscribe((data: Role[]) => {
            this.roles = data;
          },
            error => console.log(error),
            () => console.log('Get all Roles complete'));
      });


    this.updateCols();
    this.translate.onLangChange.subscribe(() => {
      this.updateCols();
    });
  }


  updateCols() {
    for (var index in this.cols) {
      let col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }


  ngOnDestroy() {
    this.roles = null;
  }

  edit(floorId: number) {
      this.roleIdEvent.emit(floorId + '');
  }

  updateTable(role: Role) {
		const index = this.roles.findIndex(x => x.id === role.id);
		
		if (index === -1) {
			this.roles.push(role);
		} else {
			this.roles[index] = role;
		}

	}

}
