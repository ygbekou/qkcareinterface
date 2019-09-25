import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { ResourceDropdown, MenuItemDropdown } from '../dropdowns';
import { GenericService, TokenStorage } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, Message } from 'primeng/api';
import { BaseComponent } from '../admin/baseComponent';
import { MenuItem } from 'src/app/models';


@Component({
  selector: 'app-menuItem-details',
  templateUrl: '../../pages/authorization/menuItemDetails.html',
  providers: [ ResourceDropdown, MenuItemDropdown]
})
export class MenuItemDetails extends BaseComponent implements OnInit, OnDestroy {
  
  menuItem: MenuItem = new MenuItem();

  messages: Message[] = [];

  @Output() menuItemSaveEvent = new EventEmitter<MenuItem>();
  
  constructor
    (
      public genericService: GenericService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      public menuItemDropdown: MenuItemDropdown,
      public resourceDropdown: ResourceDropdown,
    ) {

		  super(genericService, translate, confirmationService, tokenStorage);

  }

  ngOnInit(): void {

  }
  
  ngOnDestroy() {
    this.menuItem = null;
  }

  getMenuItem(menuItemId: number) {
    this.genericService.getOne(menuItemId, MenuItem.PACKAGE)
        .subscribe(result => {
      if (result.id > 0) {
        this.menuItem = result;
      }
    });
  }
  
  save() {
    try {
	  this.messages = [];
      this.genericService.saveWithUrl('/service/com.qkcare.model.authorization.MenuItem/save', this.menuItem)
        .subscribe(result => {
          if (result.id > 0) {
            this.processResult(result, this.menuItem, this.messages, null);
            this.menuItem = result;
			      this.menuItemSaveEvent.emit(this.menuItem);
          } else {
            this.processResult(result, this.menuItem, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }
  
  clear() {
	this.messages = [];
	this.menuItem = new MenuItem();
  }

 }
