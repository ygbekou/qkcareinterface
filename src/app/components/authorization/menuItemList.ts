import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenericService, TokenStorage } from '../../services';
import { TranslateService} from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { BaseComponent } from '../admin/baseComponent';
import { MenuItem } from 'src/app/models';

@Component({
  selector: 'app-menuItem-list',
  templateUrl: '../../pages/authorization/menuItemList.html',
  providers: []
})
export class MenuItemList extends BaseComponent implements OnInit, OnDestroy {
  
  menuItems: MenuItem[] = [];
  cols: any[];
  
  @Output() menuItemIdEvent = new EventEmitter<string>();
  
  constructor
    (
    public genericService: GenericService,
	  public translate: TranslateService,
    public confirmationService: ConfirmationService,
    public tokenStorage: TokenStorage,
    private route: ActivatedRoute
    ) {
		  super(genericService, translate, confirmationService, tokenStorage);
    
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'parentLabel', header: 'Parent', headerKey: 'COMMON.PARENT', type: 'string',
                                        style: {width: '15%', 'text-align': 'center'} },
            { field: 'label', header: 'Label', headerKey: 'COMMON.LABEL', type: 'string',
                                        style: {width: '15%', 'text-align': 'center'} },
            { field: 'language', header: 'Lang', headerKey: 'COMMON.LANG', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'} },
            { field: 'resourceName', header: 'Resource', headerKey: 'COMMON.RESOURCE', type: 'string',
                                        style: {width: '15%', 'text-align': 'center'} },
            { field: 'resourceUrlPath', header: 'Url Path', headerKey: 'COMMON.URL_PATH', type: 'string',
                                        style: {width: '30%', 'text-align': 'center'} }
        ];
    
        this.route
            .queryParams
            .subscribe(() => {          
              
                const parameters: string [] = []; 
                
                this.genericService.getAllByCriteria(MenuItem.PACKAGE, parameters)
                  .subscribe((data: MenuItem[]) => { 
                    this.menuItems = data; 
                  },
                  error => console.log(error),
                  () => console.log('Get all MenuItems complete'));
              });

      this.updateChildCols(this.cols);
      this.translate.onLangChange.subscribe(() => {
          this.updateChildCols(this.cols);
      });
  }
 
  
  ngOnDestroy() {
    this.menuItems = null;
  }
  
  edit(menuItemId: number) {
      this.menuItemIdEvent.emit(menuItemId + '');
  }

  getAllMenuItems() {
    this.genericService.getAll(MenuItem.PACKAGE)
      .subscribe((data: MenuItem[]) => { 
        this.menuItems = data; 
      },
      error => console.log(error),
      () => console.log('Get all Menu Item complete'));
  }

  updateTable(menuItem: MenuItem) {
		const index = this.menuItems.findIndex(x => x.id === menuItem.id);

		if (index === -1) {
			this.menuItems.push(menuItem);
		} else {
			this.menuItems[index] = menuItem;
		}

  }

 }
