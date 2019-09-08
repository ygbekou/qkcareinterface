import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Admission, Visit, RadInvestigation, Reference, RadInvestigationExam, RadExam, 
  RadInvestigationComment } from '../../models';
import { ModalityDropdown, RadExamDropdown, ExamStatusDropdown, RadiologyTechDropdown} from '../dropdowns';
import { GenericService, RadInvestigationService, GlobalEventsManager} from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { ScrollPanelModule} from 'primeng/scrollpanel';
import { BaseComponent } from './baseComponent';
import { DicomViewerModule } from 'ng-dicomviewer';
import { Constants } from 'src/app';

@Component({
  selector: 'app-radInvestigation-details',
  templateUrl: '../../pages/admin/radInvestigationDetails.html',
  providers: [ScrollPanelModule]
})
export class RadInvestigationDetails extends BaseComponent implements OnInit, OnDestroy {

  investigation: RadInvestigation = new RadInvestigation();
  examCols: any[];

  @Input() admission: Admission;
  @Input() visit: Visit;

  itemNumber: string;
  itemNumberLabel: 'Visit';
  messages: Message[] = [];

  modality: Reference;

  newComment: RadInvestigationComment;

  @ViewChild('picture') picture: ElementRef;
  formData = new FormData();
  pictureUrls: any[];
  displayFileBox = false;

  investigationDocs = [];

  constructor
    (
    private globalEventsManager: GlobalEventsManager,
    public genericService: GenericService,
    private investigationService: RadInvestigationService,
	public translate: TranslateService,
	public confirmationService: ConfirmationService,
	public modalityDropdown: ModalityDropdown,
	public examStatusDropdown: ExamStatusDropdown,
	public radiologyTechDropdown: RadiologyTechDropdown,
  	public examDropdown: RadExamDropdown,
    private route: ActivatedRoute
    ) {
		super(genericService, translate, confirmationService);

  }

  ngOnInit(): void {

	this.examCols = [
			{ field: 'modality', header: 'Modality', headerKey: 'COMMON.MODALITY', type: 'string',
                                        style: {width: '20%', 'text-align': 'center'} },
            { field: 'exam', header: 'Exam', headerKey: 'COMMON.EXAM', type: 'string',
                                        style: {width: '30%', 'text-align': 'center'} },
            { field: 'comments', header: 'Comments', headerKey: 'COMMON.COMMENTS', type: 'string',
                                        style: {width: '30%', 'text-align': 'center'} }
		];
		
    let investigationId = null;
    this.route
      .queryParams
      .subscribe(params => {

        investigationId = params['investigationId'];

        if (investigationId != null) {
          this.genericService.getNewObject('/service/radiology/investigation/get/', investigationId)
            .subscribe(result => {
              if (result.id > 0) {
				this.investigation = result;
				this.admission = this.investigation.admission;
				this.visit = this.investigation.visit;
				this.investigation.investigationDatetime = new Date(this.investigation.investigationDatetime);

				console.info(this.investigation);
              }
            });
        } else {

        }
	  });
	  

	this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  
	this.addNewExamRow();

  }

  ngOnDestroy() {
    this.investigation = null;
  }

  updateCols() {
// tslint:disable-next-line: forin
    for (const index in this.examCols) {
      const col = this.examCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
	}
  }
  
  addNewExamRow() {
    const ie =  new RadInvestigationExam(this.genericService);
	ie.exam = new RadExam();
    this.investigation.investigationExams.push(ie);
  }

  addNewCommentRow() {
	this.newComment = new RadInvestigationComment();
  }

  saveComment() {
	try {
	  this.messages = [];
	  this.newComment.investigation = new RadInvestigation();
	  this.newComment.investigation.id = this.investigation.id;

      this.genericService.save(this.newComment, 'com.qkcare.model.imaging.RadInvestigationComment')
        .subscribe(result => {
			this.processResult(result, this.investigation, this.messages, null);
			if (this.newComment.id != null) {
				this.investigation.investigationComments.push(this.newComment);
			}
          });
    } catch (e) {
      console.log(e);
    }
  }

  cancelComment() {
	this.newComment = null;
  }

   addNew() {
	this.messages = [];
    this.investigation = new RadInvestigation();
    this.addNewExamRow();
  }

save() {

    try {
      this.messages = [];
      if (this.visit !== undefined  && this.visit !== null && this.visit.id !== undefined) {
          this.investigation.visit = this.visit;
      }
      if (this.admission !== undefined && this.admission !== null && this.admission.id !== undefined) {
      this.investigation.admission = this.admission;
      }

        this.investigationService.saveInvestigaton(this.investigation)
          .subscribe(result => {
              this.processResult(result, this.investigation, this.messages, null);
            });
    } catch (e) {
      console.log(e);
    }
  }
  
  setSelectedVisit(event) {
    this.visit = event;
  }

  setSelectedAdmission(event) {
    this.admission = event;
  }

  clear() {
	  this.messages = [];
	  this.visit = new Visit();
	  this.admission = new Admission();
	  this.investigation = new RadInvestigation();
  }

  populateExams(event) {
    const parameters: string[] = [];

    parameters.push('e.modality.id = |modalityId|' + this.modality.id + '|Long');

    this.genericService.getAllByCriteria('RadExam', parameters)
      .subscribe((data: any[]) => {
        this.examDropdown.exams = data;
      },
      error => console.log(error),
      () => console.log('Get Exam List complete'));
  }

  
  readUrl(event: any) {
    this.pictureUrls = [];
    const myFiles = event.target.files;
    if (myFiles) {
      const reader = new FileReader();

      for (let i = 0; i < myFiles.length; i++) {
        this.read(myFiles[i], i, this.pictureUrls);
      }
    }

    //this.patient.user.picture = '';
  }


  read(file, i, urls) {
      let name = file.name;
      let reader = new FileReader();  
      reader.onload = function(e) {  
          // get file content  
          urls[i] = (<FileReader>e.target).result;
      };
    reader.readAsDataURL(file);
  }

  public onFileUpload(event): void {
    
    const myFiles = event.files;
		if (event && myFiles && (myFiles.length > 0)) {
      let tempFileNames  = [];
			for (let i = 0; i < myFiles.length; i++) {
        this.formData.append('file', myFiles[i], myFiles[i].name);
        tempFileNames.push(myFiles[i].name);
      }
      const invest = new Reference();
      invest.id = this.investigation.id;
      this.genericService.saveWithFile(invest, 'com.qkcare.model.imaging.RadInvestigation', this.formData, 'saveFiles')
          .subscribe(result => {
            if (result.id > 0) {
              this.investigationDocs.push(tempFileNames);
              this.messages.push({severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL});
            } else {
              this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL});
            }
          });
		} else {
			// this.formData.append('file', null, null);
		}
}

  toggleDisplayFileBox() {
      this.displayFileBox = !this.displayFileBox ;
      this.genericService.getObjects('/service/radinvestigation/readFiles/' + this.investigation.id)
          .subscribe(results => {
            this.investigationDocs = results;
          });
    

   
  }

  deleteFile(fileNameIndex: number, fileName: string) {
    
      this.genericService.saveWithUrl('/service/radinvestigation/deleteFile/' + this.investigation.id, fileName)
          .subscribe(result => {
            if (result.result === 'SUCCESS') {
              this.investigationDocs.splice(fileNameIndex, 1);
              alert('File deleted successfully');

            }
          });
  }

}
