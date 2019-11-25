import {Component} from '@angular/core';
import { Constants } from '../../app.constants';
import { TranslateService} from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { GenericService, TokenStorage } from 'src/app/services';
import { GenericResponse } from 'src/app/models/genericResponse';
import { PermissionVO } from 'src/app/models/authToken';
import { Visit, Admission } from 'src/app/models';

@Component({
	template: ``,
  providers: []
})
export class BaseComponent {

   public messages: Message[] = [];

  constructor
    (
		public genericService: GenericService,
		public translate: TranslateService,
        public confirmationService: ConfirmationService,
        public tokenStorage: TokenStorage
    ) {

  }

  protected processResult(result, entityObject, messages, pictureUrl) {
    if (result.errors === null || result.errors.length === 0) {
        entityObject = result;
        this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_SUCCESS']).subscribe(res => {
            messages.push({
                severity: Constants.SUCCESS, summary: res['COMMON.SAVE'],
                detail: res['MESSAGE.SAVE_SUCCESS']
            });
        });
        
        if (entityObject.user && entityObject.user.birthDate != null) {
            entityObject.user.birthDate = new Date(entityObject.user.birthDate);
        }
        if (pictureUrl) {
            pictureUrl = '';
		}
    } else {
        this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_UNSUCCESS']).subscribe(res => {
            messages.push({
                severity: Constants.ERROR, summary: res['COMMON.SAVE'],
                detail: res['MESSAGE.SAVE_UNSUCCESS'] + result.errors[0]
            });
        });
    }
  }


  deleteItem(listItems: any[], id: string, entity: string) {
    
	  if (id === undefined || id === null) {
			this.removeItem(listItems, +id);
			return;
		}

    
    this.messages = [];
		let confirmMessage = '';

        this.translate.get(['', 'MESSAGE.DELETE_CONFIRM']).subscribe(res => {
            confirmMessage = res['MESSAGE.DELETE_CONFIRM'];
		});

        this.confirmationService.confirm({
            message: confirmMessage,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.genericService.delete(+id, entity)
                    .subscribe((response: GenericResponse) => {
                        if ('SUCCESS' === response.result) {
                            this.translate.get(['COMMON.DELETE', 'MESSAGE.DELETE_SUCCESS']).subscribe(res => {
                                this.messages.push({
                                    severity: Constants.SUCCESS, summary: res['COMMON.DELETE'],
                                    detail: res['MESSAGE.DELETE_SUCCESS']
                                });
                            });
                            this.removeItem(listItems, +id);
                        } else if ('FOREIGN_KEY_FAILURE' === response.result) {
                            this.translate.get(['COMMON.DELETE', 'MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY']).subscribe(res => {
                                this.messages.push({
                                    severity: Constants.ERROR, summary: res['COMMON.DELETE'],
                                    detail: res['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY'] + '<br/>' + response.message
                                });
                            });
						} else if ('GENERIC_FAILURE' === response.result) {
                            this.translate.get(['COMMON.DELETE', 'MESSAGE.DELETE_UNSUCCESS']).subscribe(res => {
                                this.messages.push({
                                    severity: Constants.ERROR, summary: res['COMMON.DELETE'],
									detail: res['MESSAGE.DELETE_UNSUCCESS'] + '<br/>' + response.message
                                });
                            });
                        }
                    });
            },
            reject: () => {
            }
        });

	}
	
  removeItem(listItems: any[], id: number) {

	const index = listItems.findIndex(x => x.id === id);
	listItems.splice(index, 1);

  }


  updateChildCols(cols: any[]) {
    for (const index in cols) {
      const col = cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }

  }


  checkPermission(resource: string, accessAttr: string, accessVal: string) {
    const permissions = JSON.parse(this.tokenStorage.getNonMenuPermissions());
   
    const res: PermissionVO = permissions.find(x => x.name === resource);

    if (res !== null && res !== undefined) {
       
        if (accessAttr === null || accessAttr ===  undefined) {
            return true;
        }

        if ('CAN_ADD' === accessAttr && accessVal === res.canAdd) {
            return true;
        }
        if ('CAN_EDIT' === accessAttr && accessVal === res.canEdit) {
          
            return true;
        }
        if ('CAN_VIEW' === accessAttr && accessVal === res.canView) {
            return true;
        }
        if ('CAN_DELETE' === accessAttr && accessVal === res.canDelete) {
            return true;
        }
    }


    return false;
  }

  permitSave(id: number, resource: string) {
    return ((id === null || id === undefined) && this.checkPermission(resource, 'CAN_ADD', 'Y')) 
				|| ((id !== null && id !== undefined) && this.checkPermission(resource, 'CAN_EDIT', 'Y'));
  }

  permitView(resource: string) {
    return this.checkPermission(resource, 'CAN_VIEW', 'Y');
  }

  permitDelete(resource: string) {
    return this.checkPermission(resource, 'CAN_DELETE', 'Y');
  }

   shoulPermitSave(id: number, visit: Visit, admission: Admission, resourcePrefix: string) {
    return ((visit !== undefined && this.permitSave(id, 'VISIT_' + resourcePrefix))
          || (admission !== undefined && this.permitSave(id, 'ADMISSION_' + resourcePrefix))
    );
  }

  shoulPermitView(visit: Visit, admission: Admission, resourcePrefix: string) {
    return ((visit !== undefined && this.permitView('VISIT_' + resourcePrefix))
          || (admission !== undefined && this.permitView('ADMISSION_' + resourcePrefix))
    );
  }

  shoulPermitDelete(visit: Visit, admission: Admission, resourcePrefix: string) {
    return ((visit !== undefined && this.permitDelete('VISIT_' + resourcePrefix))
          || (admission !== undefined && this.permitDelete('ADMISSION_' + resourcePrefix))
    );
  }


  isEmptyStr(value) {
    return value === undefined || value === null || (typeof value === 'string' && value.trim()) === ''

  }


 }
