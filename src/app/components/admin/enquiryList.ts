import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Reference, User, Enquiry } from '../../models';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { GenericService, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-enquiry-list',
  templateUrl: '../../pages/admin/enquiryList.html',
  providers: [GenericService]
})
export class EnquiryList implements OnInit, OnDestroy {
  
  enquiries: Enquiry[] = [];
  cols: any[];
  
  @Output() enquiryIdEvent = new EventEmitter<string>();
  
  constructor
    (
    private genericService: GenericService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    ) {
  }

  ngOnInit(): void {
    
    this.cols = [
            { field: 'enquiryDatetime', header: 'Date/Time', headerKey: 'COMMON.ENQUIRY_DATETIME', type:'date' },
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME' },
            { field: 'email', header: 'Email', headerKey: 'COMMON.EMAIL' },
            { field: 'phone', header: 'Phone', headerKey: 'COMMON.PHONE' },
            { field: 'read', header: 'Read', headerKey: 'COMMON.READ' },
            { field: 'checker', header: 'Checked By', headerKey: 'COMMON.CHECKED_BY' },
        ];
    
    this.route
        .queryParams
        .subscribe(params => {
          
          let parameters: string [] = []; 
          
          this.genericService.getAllByCriteria('Enquiry', parameters)
            .subscribe((data: Enquiry[]) => 
            { 
              this.enquiries = data 
            },
            error => console.log(error),
            () => console.log('Get all Enquiries complete'));
     });
    
    
    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }
 
  
  updateCols() {
    for (var index in this.cols) {
      let col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
 
  
  ngOnDestroy() {
    this.enquiries = null;
  }
  
  edit(enquiryId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "enquiryId": enquiryId,
        }
      }
      this.router.navigate(["/admin/enquiryDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

  delete(enquiryId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "enquiryId": enquiryId,
        }
      }
      this.router.navigate(["/admin/enquiryDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

 }
