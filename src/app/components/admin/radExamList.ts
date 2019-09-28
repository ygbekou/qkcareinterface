import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';
import { RadExam } from 'src/app/models/radiology/radiologyConfig';

@Component({
  selector: 'app-radExam-list',
  templateUrl: '../../pages/admin/radExamList.html',
  providers: [GenericService]
})
export class RadExamList extends BaseComponent implements OnInit, OnDestroy {
  
  exams: RadExam[] = [];
  cols: any[];
  
  hiddenMenu = true;
  @Output() examIdEvent = new EventEmitter<string>();
  
  constructor
    (
    public genericService: GenericService,
    public translate: TranslateService,
    public confirmationService: ConfirmationService,
    public tokenStorage: TokenStorage,
    private globalEventsManager: GlobalEventsManager,
    private route: ActivatedRoute,
    private router: Router,
    ) {
		super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    this.cols = [
		 	{ field: 'modalityName', header: 'Modality', headerKey: 'COMMON.MODALITY', style: {width: '15%', 'text-align': 'center'} },
		  	{ field: 'name', header: 'Name', headerKey: 'COMMON.NAME', style: {width: '25%', 'text-align': 'center'} },
			{ field: 'description', header: 'Number', headerKey: 'COMMON.DESCRIPTION', style: {width: '30%', 'text-align': 'center'} },
			{ field: 'rate', header: 'Rate', headerKey: 'COMMON.RATE', style: {width: '10%', 'text-align': 'center'} },
            { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS', style: {width: '10%', 'text-align': 'center'} }
        ];
    
    this.route
        .queryParams
        .subscribe(params => {
          
          const parameters: string [] = []; 
            
          this.genericService.getAll('com.qkcare.model.imaging.RadExam')
            .subscribe((data: RadExam[]) => { 
              this.exams = data; 
            },
            error => console.log(error),
            () => console.log('Get all exams complete'));
     });
    
    
  this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }
 
  
  updateCols() {
    for (let index in this.cols) {
      const col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
  
  ngOnDestroy() {
    this.exams = null;
  }
  
  edit(examId: number) {
    try {
      if (this.hiddenMenu) {
        this.examIdEvent.emit(examId + '');
      } else {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            'examId': examId
          }
        };
        this.router.navigate(['/admin/radExamDetails'], navigationExtras);
      }
    } catch (e) {
      console.log(e);
    }
    
  }

  updateTable(exam: RadExam) {
		const index = this.exams.findIndex(x => x.id === exam.id);
		
		if (index === -1) {
			this.exams.push(exam);
		} else {
			this.exams[index] = exam;
		}

	}

 }
