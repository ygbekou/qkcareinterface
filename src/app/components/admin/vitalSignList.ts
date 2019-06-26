import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Admission, VitalSign } from '../../models';
import { GenericService } from '../../services';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ConfirmationService, Message } from 'primeng/api';
import { GenericResponse } from '../../models/genericResponse';
import { Constants } from '../../app.constants';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
    selector: 'app-vitalSign-list',
    templateUrl: '../../pages/admin/vitalSignList.html',
    providers: [GenericService, ConfirmationService]
})
export class VitalSignList implements OnInit, OnDestroy {

    vitalSigns: VitalSign[] = [];
    cols: any[];
    messages: Message[] = [];

    @Input() admission: Admission;
    @Output() vitalSignIdEvent = new EventEmitter<string>();

    constructor
        (
            private genericService: GenericService,
            private translate: TranslateService,
            private confirmationService: ConfirmationService,
            private route: ActivatedRoute
        ) {


    }

    ngOnInit(): void {
        this.cols = [
            { field: 'vitalSignDatetime', header: 'Date', headerKey: 'COMMON.VITAL_SIGN_DATE_TIME', type: 'date' },
            { field: 'patientMRN', header: 'Patient ID', headerKey: 'COMMON.PATIENT_ID' },
            { field: 'patientName', header: 'Patient Name', headerKey: 'COMMON.PATIENT_NAME' },
            { field: 'temperature', header: 'Temperature', headerKey: 'COMMON.TEMPERATURE' },
            { field: 'pulse', header: 'Pulse', headerKey: 'COMMON.PULSE' },
            { field: 'respiration', header: 'Respiration', headerKey: 'COMMON.RESPIRATION' },
            { field: 'bloodPressure', header: 'Blood Pressure', headerKey: 'COMMON.BLOOD_PRESSURE' },
            { field: 'bloodSugar', header: 'Blood Sugar', headerKey: 'COMMON.BLOOD_SUGAR' },
            { field: 'pain', header: 'Pain', headerKey: 'COMMON.PAIN' },
            { field: 'weight', header: 'Weight(pound)', headerKey: 'COMMON.WEIGHT' },
            { field: 'height', header: 'Height(in)', headerKey: 'COMMON.HEIGHT' },
            { field: 'bmi', header: 'BMI', headerKey: 'COMMON.BMI' }
        ];

        let parameters: string[] = [];

        if (this.admission && this.admission.id > 0) {
            parameters.push('e.admission.id = |admissionId|' + this.admission.id + '|Long')
        }

        this.route
            .queryParams
            .subscribe(params => {

                this.genericService.getAllByCriteria('VitalSign', parameters)
                    .subscribe((data: VitalSign[]) => {
                        this.vitalSigns = data
                        console.log(this.vitalSigns)
                    },
                        error => console.log(error),
                        () => console.log('Get all VitalSigns complete'));
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
        this.vitalSigns = null;
    }

    edit(prescriptionId: string) {
        this.vitalSignIdEvent.emit(prescriptionId);
    }

    delete(vitalSignId: string) {
        this.messages = [];
        let confirmMessage = '';
        this.translate.get(['', 'MESSAGE.DELETE_CONFIRM']).subscribe(res => {
            confirmMessage = res['MESSAGE.DELETE_CONFIRM'];
        });

        this.confirmationService.confirm({
            message: confirmMessage,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.genericService.delete(+vitalSignId, 'VitalSign')
                    .subscribe((response: GenericResponse) => {
                        if ('SUCCESS' === response.result) {
                            this.translate.get(['', 'MESSAGE.DELETE_SUCCESS']).subscribe(res => {
                                this.messages.push({
                                    severity: Constants.SUCCESS, summary: res['COMMON.DELETE'],
                                    detail: res['MESSAGE.DELETE_SUCCESS']
                                });
                            });
                            this.ngOnInit();
                        } else if ('FAILURE' === response.result) {
                            this.translate.get(['', 'MESSAGE.DELETE_UNSUCCESS']).subscribe(res => {
                                this.messages.push({
                                    severity: Constants.ERROR, summary: res['COMMON.DELETE'],
                                    detail: res['MESSAGE.DELETE_UNSUCCESS']
                                });
                            });
                        }
                    });
            },
            reject: () => {
            }
        });

    }

    
}
