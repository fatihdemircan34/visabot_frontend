import {AppointmentStatusEnum} from "@/enums/appointmentStatus.enum";
import {CountryEnum} from "@/enums/country.enum";

export interface AppointmentObject {
    key: number;
    firstName: string;
    lastName: string;
    passportNumber: string;
    contactNumber: string;
    email: string;
    is_vip: boolean;
    country: CountryEnum;
    country_name: string;
    dataset: string;
    status: AppointmentStatusEnum;
    priority: number|undefined;
    created_at: Date;
    updated_at: Date|undefined;
    started_at?: Date|undefined;
    completed_at?: Date|undefined;
    appointment_date?: Date|undefined;
    error?: string|undefined;
}