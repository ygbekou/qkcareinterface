import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Enquiry } from '../../models';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { GenericService, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-enquiry-list',
  templateUrl: '../../pages/admin/enquiryList.html',
  providers: [GenericService]
})
export class EnquiryList extends BaseComponent implements OnInit, OnDestroy {
  
  enquiries: Enquiry[] = [];
  cols: any[];
  
  @Output() enquiryIdEvent = new EventEmitter<string>();
  
  constructor
    (
    public genericService: GenericService,
    public confirmationService: ConfirmationService,
    public translate: TranslateService,
    public tokenStorage: TokenStorage,
    private route: ActivatedRoute,
    private router: Router,
    ) {
      super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    
    this.cols = [
            { field: 'enquiryDatetime', header: 'Date/Time', headerKey: 'COMMON.ENQUIRY_DATETIME', type: 'date' },
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME' },
            { field: 'email', header: 'Email', headerKey: 'COMMON.EMAIL' },
            { field: 'phone', header: 'Phone', headerKey: 'COMMON.PHONE' },
            { field: 'read', header: 'Read', headerKey: 'COMMON.READ' },
            { field: 'checker', header: 'Checked By', headerKey: 'COMMON.CHECKED_BY' },
        ];
    
    this.route
        .queryParams
        .subscribe(params => {
          
          const parameters: string [] = []; 
          
          this.genericService.getAllByCriteria('Enquiry', parameters)
            .subscribe((data: Enquiry[]) => { 
              this.enquiries = data; 
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
    // tslint:disable-next-line: forin
    for (const index in this.cols) {
      const col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
 
  
  ngOnDestroy() {
    this.enquiries = null;
  }
  
  edit(enquiryId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'enquiryId': enquiryId,
        }
      };
      this.router.navigate(['/admin/enquiryDetails'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

  delete(enquiryId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'enquiryId': enquiryId,
        }
      };
      this.router.navigate(['/admin/enquiryDetails'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

 }
