import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { SectionItem } from '../../models/website';
import { Constants } from '../../app.constants';
import { SectionDropdown } from './../dropdowns';
import { GenericService } from '../../services';
import { TranslateService} from '@ngx-translate/core';
import { Message } from 'primeng/api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-sectionItem-details',
  templateUrl: '../../pages/admin/sectionItemDetails.html',
  providers: [GenericService, SectionDropdown]

})
// tslint:disable-next-line:component-class-suffix
export class SectionItemDetails implements OnInit, OnDestroy {

    sectionItem: SectionItem = new SectionItem();
    messages: Message[] = [];
    @ViewChild('picture') picture: ElementRef;
    @Output() sectionItemSavedEvent = new EventEmitter<SectionItem>();
    formData = new FormData();
    pictureUrl: any = '';

    constructor
    (
      private genericService: GenericService,
      private translate: TranslateService,
      public  sectionDropdown: SectionDropdown    ) {
      this.sectionItem = new SectionItem();
  }



  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.sectionItem = null;
  }

  getSectionItem(sectionItemId: number) {
    this.messages = [];
    this.genericService.getOne(sectionItemId, 'com.qkcare.model.website.SectionItem')
        .subscribe(result => {
      if (result.id > 0) {
        this.sectionItem = result;
      } else {
        this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
          this.messages.push({severity: Constants.ERROR, summary: res['COMMON.READ'], detail: res['MESSAGE.READ_FAILED']});
        });
      }
    });
  }

  clear() {
    this.sectionItem = new SectionItem();
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
      // this.formData.append('file', null, null);
    }

    try {
      if (pictureEl && pictureEl.files && pictureEl.files.length > 0) {
        this.sectionItem.fileLocation = '';
        this.genericService.saveWithFile(this.sectionItem, 'com.qkcare.model.website.SectionItem', this.formData, 'saveWithFile')
          .subscribe(result => {
            if (result.id > 0) {
              this.sectionItem = result;
              this.sectionItemSavedEvent.emit(result);
              this.messages.push({severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL});
              this.clearPictureFile();
            } else {
              this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL});
            }
          });
      } else {
        this.genericService.save(this.sectionItem, 'com.qkcare.model.website.SectionItem')
          .subscribe(result => {
            if (result.id > 0) {
              this.sectionItem = result;
              this.sectionItemSavedEvent.emit(result);
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

  clearPictureFile() {
    this.pictureUrl = '';
    this.picture.nativeElement.value = '';
  }

 }
