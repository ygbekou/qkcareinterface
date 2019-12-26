import {Component, LOCALE_ID, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router} from '@angular/router';
import {Constants} from '../../app.constants';
import {Message} from 'primeng/primeng';

@Component({
  selector: 'file-uploader',
  templateUrl: '../../pages/admin/fileUploader.html',
  providers: [{provide: LOCALE_ID, useValue: Constants.LOCALE}, Constants]
})


export class FileUploader implements OnInit {
  displayFileUploaderDialog: boolean;
  uploadFileUrl: string;
  msgs: Message[];
  errorMessage: string;
  uploadedFiles: any[] = [];

  CLOSE_LABEL: string = Constants.CLOSE_LABEL;

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  onSubmit() {
  }

  onUpload(event) {
    this.errorMessage = event.xhr.response;
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.msgs = [];
    this.msgs.push({severity: 'info', summary: Constants.FILE_UPLOADED, detail: event.xhr.response});
  }

  showDialogToUploadImage(entity, data) {
    this.displayFileUploaderDialog = true;
    this.uploadFileUrl = Constants.apiServer + "/service/fileUploader/uploadFile/" + entity + "/" + data.id;
  }

  uploadFile(entity) {
    this.displayFileUploaderDialog = true;
    this.uploadFileUrl = Constants.apiServer + "/service/fileUploader/load/" + entity;
  }

  myUploader(event) {
    //event.files == files to upload
    alert('Here')
  }
  
  close() {
    this.errorMessage = " ";
    this.displayFileUploaderDialog = false;
    this.changeDetectorRef.detectChanges();
    this.uploadedFiles = [];
  }
}
