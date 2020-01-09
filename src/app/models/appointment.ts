import { HospitalLocation } from './hospitalLocation';
import { Department } from './department';
import { Employee } from './employee';
import { Patient } from './patient';

export class Appointment {
	id: number;
	doctor: Employee = new Employee();
	department: Department = new Department();
	patient: Patient = new Patient();
	hospitalLocation: HospitalLocation = new HospitalLocation();
	appointmentDate: Date;
	appointmentDateStr: string;
	beginTime: string;
	endTime: string;
	problem: string;
	status: number;
	statusDesc: string;
	doctorName: string;
	departmentName: string;
}
