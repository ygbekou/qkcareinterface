import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Department } from '../../models';
import { Constants } from '../../app.constants';
import { GenericService } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-department-details',
  templateUrl: '../../pages/admin/departmentDetails.html',
  providers: [GenericService]

})

// tslint:disable-next-line:component-class-suffix
export class DepartmentDetails implements OnInit, OnDestroy {

    department: Department = new Department();
    messages: Message[] = [];
    @ViewChild('picture') picture: ElementRef;
    formData = new FormData();
    multiple = false;

    constructor
    (
      private genericService: GenericService,
      private translate: TranslateService,
    ) {
      this.department = new Department();
  }



  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.department = null;
  }

  getDepartment(departmentId: number) {
    this.messages = [];
    this.genericService.getOne(departmentId, 'Department')
        .subscribe(result => {
      if (result.id > 0) {
        this.department = result;
      } else {
        this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
          this.messages.push({severity:
            Constants.ERROR, summary:
            res['COMMON.READ'], detail:
            res['MESSAGE.READ_FAILED']});
        });
      }
    });
  }
  
  clear() {
    this.department = new Department();
  }


  save() {
    this.formData = new FormData();

    const pictureEl = this.picture.nativeElement;
    if (pictureEl && pictureEl.files && (pictureEl.files.length > 0)) {
      const files: FileList = pictureEl.files;
      for (let i = 0; i < files.length; i++) {
          this.formData.append('file', files[i], files[i].name);
      }
    } else {
       this.formData.append('file', null, null);
    }

    try {
      if (pictureEl && pictureEl.files && pictureEl.files.length > 0) {
        this.department.fileLocation = '';
        this.genericService.saveWithFile(this.department, 'Department', this.formData, 'saveWithFile')
          .subscribe(result => {
            if (result.id > 0) {
              this.department = result;
              this.messages.push({severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL});
            } else {
              this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL});
            }
          });
      } else {
        this.genericService.save(this.department, 'Department')
          .subscribe(result => {
            if (result.id > 0) {
              this.department = result;
              this.messages.push({severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL});
            } else {
              this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL});
            }
          });
      }
    } catch (e) {
      console.log(e);
    }
  }

  delete(){}


 }
