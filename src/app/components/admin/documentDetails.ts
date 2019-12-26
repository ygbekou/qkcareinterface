import {Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Document} from '../../models/document';
import {Constants} from '../../app.constants';
import { Patient } from '../../models/patient';
import {DoctorDropdown} from '../dropdowns';
import {GenericService, UserService} from '../../services';


import {Observable} from 'rxjs/Rx';

import {Http, Headers} from '@angular/http';

@Component({
  selector: 'app-document-details',
  templateUrl: '../../pages/admin/documentDetails.html',
  providers: [GenericService, DoctorDropdown]
})
  
export class DocumentDetails implements OnInit, OnDestroy {

  public error: String = '';
  displayDialog: boolean;
  document: Document = new Document();
  doctorDropdown: DoctorDropdown;

  uploadedFiles: any[] = [];
  formData = new FormData();
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;
  DEPARTMENT: string = Constants.DEPARTMENT;
  DOCTOR: string = Constants.DOCTOR;
  ROLE: string = Constants.ROLE;

  @ViewChild('tasknote', {static: false}) input: ElementRef;
  
  constructor
    (
    private genericService: GenericService,
    private userService: UserService,
    private docDropdown: DoctorDropdown,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef,
    private http: Http
    ) {
    this.doctorDropdown = docDropdown;
  }

  ngOnInit(): void {

    let documentId = null;
    this.route
      .queryParams
      .subscribe(params => {

        this.document.patient = new Patient();
        documentId = params['documentId'];

        if (documentId != null) {
          this.genericService.getOne(documentId, 'Document')
            .subscribe(result => {
              if (result.id > 0) {
                this.document = result
              }
              else {
                this.error = Constants.SAVE_UNSUCCESSFUL;
                this.displayDialog = true;
              }
            })
        } else {

        }
      });

  }

  ngOnDestroy() {
    this.document = null;
  }
  
  fileChange(event): void {
        let inputEl = this.input.nativeElement;
        if (inputEl.files.length == 0) return;

        let fileList :FileList = inputEl.files;
    
        if (fileList.length > 0) {
            const file = fileList[0];

            const formData = new FormData();
            formData.append('file', file, file.name);
            
            formData.append('id', new Blob([JSON.stringify('1235')],
            {
                type: "application/json"
            }));

            const headers = new Headers();
            // It is very important to leave the Content-Type empty
            // do not use headers.append('Content-Type', 'multipart/form-data');
            //headers.append('Authorization', 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9....');
            //const options = new RequestOptions({headers: headers});

            this.http.post(Constants.apiServer + '/service/fileUploader/uploadFile', formData, {headers: headers})
                 .map(res => res.json())
                 .catch(error => Observable.throw(error))
                 .subscribe(
                     data => console.log('success'),
                     error => console.log(error)
                 );
        }
    }
  
  
  save() {
    try {
      this.error = '';
      
      this.formData = new FormData();
      let inputEl = this.input.nativeElement;
      if (inputEl.files.length == 0) return;

      let files :FileList = inputEl.files;
      for(var i = 0; i < files.length; i++){
          alert(files[i].name)
          this.formData.append('file', files[i], files[i].name);
      }
      
      
      this.genericService.saveWithFile(this.document, "Document", this.formData, 'saveWithFile')
        .subscribe(result => {
          if (result.id > 0) {
            this.document = result
          }
          else {
            this.error = Constants.SAVE_UNSUCCESSFUL;
            this.displayDialog = true;
          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }

}
