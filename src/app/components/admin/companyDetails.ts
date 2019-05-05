import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Company } from '../../models/company';
import { Constants } from '../../app.constants';
import { GenericService } from '../../services';
import { Message } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-company-details',
  templateUrl: '../../pages/admin/companyDetails.html',
  providers: [GenericService]
})
// tslint:disable-next-line:component-class-suffix
export class CompanyDetails implements OnInit, OnDestroy {

  company: Company = new Company();

  @ViewChild('logo') logo: ElementRef;
  @ViewChild('favicon') favicon: ElementRef;
  @ViewChild('backgroundSlider') backgroundSlider: ElementRef;
  formData = new FormData();
  messages: Message[] = [];
  logoUrl: any = '';
  faviconUrl: any = '';

  constructor
  (
      private genericService: GenericService,
      public translate: TranslateService,
      private route: ActivatedRoute,
      private router: Router 
    ) {

  }

  ngOnInit(): void {

    const parameters: string [] = [];
    // parameters.push('e.status = |status|0|Integer');

    this.genericService.getAllByCriteria('Company', parameters)
       .subscribe((data: Company[]) => {
          if (data.length > 0) {
            this.company = data[0];
          } else {
            this.company = new Company();
          }
        },
        error => console.log(error),
        () => console.log('Get Company complete'));

  }

  ngOnDestroy() {
    this.company = null;
  }

  save() {
    this.formData = new FormData();
    let nbFiles: Number = 0 ;

    const logoEl = this.logo.nativeElement;
    if (logoEl && logoEl.files && (logoEl.files.length > 0)) {
      const files: FileList = logoEl.files;
      for (let i = 0; i < files.length; i++) {
          this.formData.append('file[]', files[i], 'logo' + '.' + files[i].name.split('.')[1]);
          nbFiles = +1;
      }
    }

    const faviconEl = this.favicon.nativeElement;
    if (faviconEl && faviconEl.files && (faviconEl.files.length > 0)) {
      const files: FileList = faviconEl.files;
      for (let i = 0; i < files.length; i++) {
          this.formData.append('file[]', files[i], 'favicon' + '.' + files[i].name.split('.')[1]);
          nbFiles = +1;
      }
    }

    try {
      if (nbFiles > 0) {
        this.company.logo = '';
        this.company.favicon = '';
        this.genericService.saveWithFile(this.company, 'Company', this.formData, 'saveCompany')
          .subscribe(result => {
            if (result.id > 0) {
              this.company = result;
              this.messages.push({severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL});
            } else {
              this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL});
            }
          });
      } else {
        this.genericService.save(this.company, 'Company')
          .subscribe(result => {
            if (result.id > 0) {
              this.company = result;
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

   getCompany(companyId: number) {
    this.messages = [];
    this.genericService.getOne(companyId, 'Company')
        .subscribe(result => {
      if (result.id > 0) {
        this.company = result;
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

  readUrl(event: any, targetName: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      // tslint:disable-next-line:no-shadowed-variable
      reader.onload = (event: ProgressEvent) => {
        if ('logo' === targetName) {
            this.logoUrl = (<FileReader>event.target).result;
        } else if ('favicon' === targetName) {
            this.faviconUrl = (<FileReader>event.target).result;
        }
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  clearLogoFile() {
    this.logoUrl = '';
    this.logo.nativeElement.value = '';
  }

  clearFaviconFile() {
    this.faviconUrl = '';
    this.favicon.nativeElement.value = '';
  }

  clear() {
    this.company = new Company();
  }

 }
