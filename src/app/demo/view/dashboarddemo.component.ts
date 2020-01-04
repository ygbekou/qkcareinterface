import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdmissionService, AppointmentService, GenericService, VisitService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
// tslint:disable-next-line:import-blacklist
import { Subscription } from 'rxjs/Rx';
import { Appointment } from '../../models';

@Component({
    templateUrl: './dashboard.component.html'
})
export class DashboardDemoComponent implements OnInit, OnDestroy {

    appointmentItem: ChartItem = new ChartItem();
    admissionItem: ChartItem = new ChartItem();
    visitItem: ChartItem = new ChartItem();
    subscription: Subscription;
    upcomingAppointments: Appointment[] = [];
    selectedAppointment: Appointment;
    upcomingAppointmentCols: any[];


    constructor(
        private appointmentService: AppointmentService,
        private admissionService: AdmissionService,
        private visitService: VisitService,
        private translate: TranslateService
    ) {

/* 
        this.subscription = this.appointmentService.getByMonths()
              .subscribe((data: any) => {
                  this.appointmentItem = this.pullData(data, 'Monthly Appointment', '#00ff00', '#00ff00');
              },
              error => console.log(error),
              () => console.log('Get all month data complete')
        );


        this.subscription.add(this.admissionService.getByMonths()
                .subscribe((data: any) => {
                    this.admissionItem = this.pullData(data, 'Monthly Admission', '#c4ffc1', '#c4ffc1');
                },
              error => console.log(error),
              () => console.log('Get all month data complete')
        ));


       this.subscription.add(this.visitService.getByMonths()
                .subscribe((data: any) => {
                    this.visitItem = this.pullData(data, 'Monthly Visit', '#ffc100', '#ffc100');
                },
              error => console.log(error),
              () => console.log('Get all month data complete')
        ));
 */

        this.subscription.add(this.appointmentService.getUpomings()
                .subscribe((data: any) => {
                    this.upcomingAppointments = data;
                    // tslint:disable-next-line:no-console
                    console.info(this.upcomingAppointments);
                },
              error => console.log(error),
              () => console.log('Get all upcoming appointments complete')
        ));
    }


    pullData(data: any, itemLabel: any, backgroundColor: any, borderColor: any) {

        const chartItem: ChartItem = new ChartItem();

        const labels: any = [];
        const labelDatas: any = [];
        // tslint:disable-next-line:forin
        let i = 0;
        // tslint:disable-next-line:forin
        for (const index in data) {
            this.translate.get(['DATE.' + index]).subscribe(res => {
                labels[i] = res['DATE.' + index];
            });

            labelDatas[i] = data[index].length;
            chartItem.itemTotal += data[index].length;
            i = i + 1;

        }

        chartItem.itemData = {
            labels: labels,
            datasets: [
                {
                    label: itemLabel,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    data: labelDatas
                }
            ]
        };

        return chartItem;

    }


    ngOnInit(): void {
        this.upcomingAppointmentCols = [
            { field: 'appointmentDate', header: 'Date', type: 'Date' },
            { field: 'beginTime', header: 'Begin Time' },
            { field: 'endTime', header: 'End Time' },
            { field: 'doctorName', header: 'Doctor' },
            { field: 'departmentName', header: 'Department' }
        ];
    }


    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}


export class ChartItem {
    itemData: any;
    itemTotal = 0;
}
