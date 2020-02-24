import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Admission, VitalSign } from '../../models';
import { GenericService, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ConfirmationService, Message } from 'primeng/api';
import { BaseComponent } from './baseComponent';


@Component({
    selector: 'app-vitalSign-list',
    templateUrl: '../../pages/admin/vitalSignList.html',
    providers: [GenericService, ConfirmationService]
})
// tslint:disable-next-line: component-class-suffix
export class VitalSignList extends BaseComponent implements OnInit, OnDestroy {

    vitalSigns: VitalSign[] = [];
    cols: any[];
    messages: Message[] = [];

    @Input() admission: Admission;
    @Output() vitalSignIdEvent = new EventEmitter<string>();

    constructor
        (
			private route: ActivatedRoute,
			public genericService: GenericService,
			public translate: TranslateService,
            public confirmationService: ConfirmationService,
            public tokenStorage: TokenStorage,
        ) {
		super(genericService, translate, confirmationService, tokenStorage);
	}

    ngOnInit(): void {
        this.cols = [
            { field: 'vitalSignDatetime', header: 'Date', headerKey: 'COMMON.VITAL_SIGN_DATE_TIME', type: 'date' },
            { field: 'temperature', header: 'Temperature', headerKey: 'COMMON.TEMPERATURE' },
            { field: 'pulse', header: 'Pulse', headerKey: 'COMMON.PULSE' },
            { field: 'respiration', header: 'Respiration', headerKey: 'COMMON.RESPIRATION' },
            { field: 'diatolicBloodPressure', header: 'Blood Pressure', headerKey: 'COMMON.DIASTOLIC_BLOOD_PRESSURE' },
            { field: 'systolicBloodPressure', header: 'Blood Pressure', headerKey: 'COMMON.SYSTOLIC_BLOOD_PRESSURE' },
            { field: 'meanBloodPressure', header: 'Blood Pressure', headerKey: 'COMMON.MEAN_BLOOD_PRESSURE' },
            { field: 'bloodSugar', header: 'Blood Sugar', headerKey: 'COMMON.BLOOD_SUGAR' },
            { field: 'pain', header: 'Pain', headerKey: 'COMMON.PAIN' },
            { field: 'weight', header: 'Weight(pound)', headerKey: 'COMMON.WEIGHT' },
            { field: 'height', header: 'Height(in)', headerKey: 'COMMON.HEIGHT' },
            { field: 'bmi', header: 'BMI', headerKey: 'COMMON.BMI' }
        ];

        const parameters: string[] = [];

        if (this.admission && this.admission.id > 0) {
            parameters.push('e.admission.id = |admissionId|' + this.admission.id + '|Long');
        }

        this.route
            .queryParams
            .subscribe(params => {

                this.genericService.getAllByCriteria('VitalSign', parameters)
                    .subscribe((data: VitalSign[]) => {
                        this.vitalSigns = data;
                        console.log(this.vitalSigns);
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
        for (let index in this.cols) {
            const col = this.cols[index];
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

	updateTable(vitalSign: VitalSign) {
		const index = this.vitalSigns.findIndex(x => x.id === vitalSign.id);

		if (index === -1) {
			this.vitalSigns.push(vitalSign);
		} else {
			this.vitalSigns[index] = vitalSign;
		}

	}



}
