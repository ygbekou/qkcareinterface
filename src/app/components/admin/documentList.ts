import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Document } from '../../models/document';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { GenericService } from '../../services';

@Component({
  selector: 'app-document-list',
  templateUrl: '../../pages/admin/documentList.html',
  providers: [GenericService]
})
export class DocumentList implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  documents: Document[] = [];
  cols: any[];
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  
  constructor
    (
    private genericService: GenericService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    ) {

    
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'patientName', header: 'Patient' },
            { field: 'doctorName', header: 'Doctor' },
            { field: 'description', header: 'Description' },
            { field: 'status', header: 'Status' }
        ];
    
        this.genericService.getAll('Document')
          .subscribe((data: Document[]) => 
          { 
            this.documents = data 
          },
          error => console.log(error),
          () => console.log('Get all documents complete'));
         
  }
 
  
  ngOnDestroy() {
    this.documents = null;
  }
  
  edit(documentId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "documentId": documentId,
        }
      }
      this.router.navigate(["/admin/documentDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

  delete(documentId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "documentId": documentId,
        }
      }
      this.router.navigate(["/admin/documentDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

 }
