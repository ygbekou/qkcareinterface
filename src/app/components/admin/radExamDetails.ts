import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalityDropdown } from '../dropdowns';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService} from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';
import { RadExam } from 'src/app/models/radiology/radiologyConfig';

@Component({
  selector: 'app-radExam-details',
  templateUrl: '../../pages/admin/radExamDetails.html',
  providers: [ModalityDropdown]
  
}) 
export class RadExamDetails extends BaseComponent implements OnInit, OnDestroy {
  
  exam: RadExam = new RadExam();
  
  messages: Message[] = [];
  @Output() examSaveEvent = new EventEmitter<RadExam>();
 
  constructor
    (
      public genericService: GenericService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      private globalEventsManager: GlobalEventsManager,
      private modalityDropdown: ModalityDropdown,
      private route: ActivatedRoute
    ) {
		    super(genericService, translate, confirmationService, tokenStorage);
      	this.clear();
  }

  
  ngOnInit(): void {
    this.clear();
    let imagingId = null;
    this.route
        .queryParams
        .subscribe(params => {
          imagingId = params['imagingId'];
          
          if (imagingId != null) {
              this.genericService.getOne(imagingId, 'Imaging')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.exam = result;
                }
              });
          }
        });
    
  }
  
  ngOnDestroy() {
    this.exam = null;
  }

  getExam(examId: number) {
    this.genericService.getOne(examId, 'com.qkcare.model.imaging.RadExam')
        .subscribe(result => {
      if (result.id > 0) {
        this.exam = result;
      }
    });
  }
  
  clear() {
    this.exam = new RadExam();
  }
  
  save() {
    try {
      this.messages = [];
      
      this.genericService.save(this.exam, 'com.qkcare.model.imaging.RadExam')
        .subscribe(result => {
          if (result.id > 0) {
			this.processResult(result, this.exam, this.messages, null);
			this.exam = result;
			this.examSaveEvent.emit(this.exam);
          } else {
            this.processResult(result, this.exam, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }
  
}