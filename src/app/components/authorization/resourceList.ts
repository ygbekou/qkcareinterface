import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenericService } from '../../services';
import { TranslateService} from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { BaseComponent } from '../admin/baseComponent';
import { Resource, Permission } from 'src/app/models';

@Component({
  selector: 'app-resource-list',
  templateUrl: '../../pages/authorization/resourceList.html',
  providers: []
})
export class ResourceList extends BaseComponent implements OnInit, OnDestroy {
  
  resources: Resource[] = [];
  cols: any[];
  allResources = [];
  
  @Output() resourceIdEvent = new EventEmitter<string>();
  @Output() selectedResourceEmit: EventEmitter<Resource> = new EventEmitter<Resource>();
  @Input() sourcePage: string = '';
  
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
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME', type: 'string',
                                        style: {width: '20%', 'text-align': 'center'} },
            { field: 'urlPath', header: 'Url Path', headerKey: 'COMMON.URL_PATH', type: 'string',
                                        style: {width: '40%', 'text-align': 'center'} },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'string',
                                        style: {width: '30%', 'text-align': 'center'} }
        ];
    
        this.getAllResources();

        this.updateCols();
        this.translate.onLangChange.subscribe(() => {
            this.updateCols();
        });
  }
 
  
  updateCols() {
    for (const index in this.cols) {
      const col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }

  }

  getAllResources() {
      this.route.queryParams.subscribe(() => {          
        
          const parameters: string [] = []; 
          
          this.genericService.getAllByCriteria('com.qkcare.model.authorization.Resource', parameters)
            .subscribe((data: Resource[]) => { 
              this.resources = data; 
              this.allResources = data.slice();
            },
            error => console.log(error),
            () => console.log('Get all Resources complete'));
        });
  }
  
  ngOnDestroy() {
    this.resources = null;
  }
  
  edit(resourceId: number) {
      this.resourceIdEvent.emit(resourceId + '');
  }
  
  assignToRole(resource: Resource) {
    const ind = this.resources.findIndex(x => x.id === resource.id);
    this.resources.splice(ind, 1);
    
    this.selectedResourceEmit.emit(resource);

  }

  updateTable(resource: Resource) {
		const index = this.resources.findIndex(x => x.id === resource.id);

		if (index === -1) {
			this.resources.push(resource);
		} else {
			this.resources[index] = resource;
		}

  }
  

  removeFromList(rrs: Permission[]) {
    
    this.resources = this.allResources.slice(); 
    for (const index in rrs) {
      const rr = rrs[index];
      const ind = this.resources.findIndex(x => x.id === rr.resource.id);
      this.resources.splice(ind, 1);
    }
  }


  addToList(rr: Permission) {
    this.resources.push(rr.resource);
  }

 }
