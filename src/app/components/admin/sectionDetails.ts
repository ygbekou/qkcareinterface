import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Section } from '../../models/website';
import { Constants } from '../../app.constants';
import { GenericService } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-section-details',
  templateUrl: '../../pages/admin/sectionDetails.html',
  providers: [GenericService]

})
// tslint:disable-next-line:component-class-suffix
export class SectionDetails implements OnInit, OnDestroy {

  section: Section = new Section();
  messages: Message[] = [];
  formData = new FormData();
  pictureUrl: any = '';
  showInMenu = false;
  @Output() sectionSavedEvent = new EventEmitter<Section>();
  constructor
    (
      private genericService: GenericService,
      private translate: TranslateService
    ) {
    this.section = new Section();
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.section = null;
  }

  getSection(sectionId: number) {
    this.messages = [];
    this.genericService.getOne(sectionId, 'com.qkcare.model.website.Section')
      .subscribe(result => {
        if (result.id > 0) {
          this.section = result;
          this.showInMenu = this.section.showInMenu === 'Y';
        } else {
          this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
            this.messages.push({
              severity:
                Constants.ERROR, summary:
                res['COMMON.READ'], detail:
                res['MESSAGE.READ_FAILED']
            });
          });
        }
      });
  } 

  clear() {
    this.section = new Section();
  }

  save() {
    try {
      this.section.showInMenu = this.showInMenu ? 'Y' : 'N'; 
      this.genericService.save(this.section, 'com.qkcare.model.website.Section')
        .subscribe(result => {
          if (result.id > 0) {
            this.section = result;
            this.sectionSavedEvent.emit(result);
            //this.sectionList.updateTable(result);
            this.messages.push({ severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL });
          } else {
            this.messages.push({ severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL });
          }
        });

    } catch (e) {
      console.log(e);
    }
  }

  delete() {

  }

  readUrl(event: any, targetName: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      // tslint:disable-next-line:no-shadowed-variable
      reader.onload = (event: ProgressEvent) => {
        this.pictureUrl = (<FileReader>event.target).result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}
