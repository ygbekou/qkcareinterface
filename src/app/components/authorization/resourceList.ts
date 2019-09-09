import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenericService } from '../../services';
import { TranslateService} from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { BaseComponent } from '../admin/baseComponent';
import { Resource } from 'src/app/models';

@Component({
  selector: 'app-resource-list',
  templateUrl: '../../pages/authorization/resourceList.html',
  providers: []
})
export class ResourceList extends BaseComponent implements OnInit, OnDestroy {
  
  resources: Resource[] = [];
  cols: any[];
  
  @Output() resourceIdEvent = new EventEmitter<string>();
  
  constructor
    (
    public genericService: GenericService,
	  public translate: TranslateService,
	  public confirmationService: ConfirmationService,
    private route: ActivatedRoute
    ) {
		  super(genericService, translate, confirmationService);
    
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'parentName', header: 'Parent', headerKey: 'COMMON.PARENT', type: 'string',
                                        style: {width: '20%', 'text-align': 'center'} },
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME', type: 'string',
                                        style: {width: '15%', 'text-align': 'center'} },
            { field: 'urlPath', header: 'Url Path', headerKey: 'COMMON.URL_PATH', type: 'string',
                                        style: {width: '15%', 'text-align': 'center'} },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'string',
                                        style: {width: '30%', 'text-align': 'center'} },
            { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'} }
        ];
    
    this.route
        .queryParams
        .subscribe(() => {          
          
            const parameters: string [] = []; 
            
            this.genericService.getAllByCriteria('com.qkcare.model.authorization.Resource', parameters)
              .subscribe((data: Resource[]) => { 
                this.resources = data; 
              },
              error => console.log(error),
              () => console.log('Get all Resources complete'));
          });
  
      this.updateCols();
      this.translate.onLangChange.subscribe(() => {
          this.updateCols();
      });
  }
 
  
  updateCols() {
    for (let index in this.cols) {
      const col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }

  }
  
  ngOnDestroy() {
    this.resources = null;
  }
  
  edit(resourceId: number) {
      this.resourceIdEvent.emit(resourceId + '');
  }
  
  getAllResources() {
    this.genericService.getAll('com.qkcare.model.authorization.Resource')
      .subscribe((data: Resource[]) => { 
        this.resources = data; 
      },
      error => console.log(error),
      () => console.log('Get all Resources complete'));
  }

  updateTable(resource: Resource) {
		const index = this.resources.findIndex(x => x.id === resource.id);

		if (index === -1) {
			this.resources.push(resource);
		} else {
			this.resources[index] = resource;
		}

  }

 }
