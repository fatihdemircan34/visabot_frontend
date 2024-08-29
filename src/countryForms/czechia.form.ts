import {CountryStepsInterface} from "@/interfaces/countrySteps.interface";

export class CzechiaForm implements CountryStepsInterface{
     Steps = [
        {
            content: [
                {
                    type: 'select',
                    name: 'visaCenter',
                    label: 'Vize Başvuru Merkezinizi Seçiniz',
                    placeholder: 'Vize Başvuru Merkezinizi Seçiniz',
                    selector: '#mat-select-0',
                    options: [
                        { value: 'ANKARA', label: 'Czech Republic Visa Application Centre - Ankara' },
                        { value: 'CR-ANT', label: 'Czech Republic Visa Application Centre - Antalya' },
                        { value: 'Beyoglu', label: 'Czech Republic Visa Application Centre - Istanbul Beyoglu' },
                        { value: 'CR-IZM', label: 'Czech Republic Visa Application Centre - Izmir' },
                    ],
                },
                {
                    type: 'select',
                    name: 'applicationCategory',
                    label: 'Başvuru Kategorinizi Seçiniz',
                    placeholder: 'Başvuru Kategorinizi Seçiniz',
                    selector: '#mat-select-4',
                    options: [
                        { value: 'short-term', label: 'KISA DONEM VIZE BASVURUSU / SHORT TERM VISA APPLICATION' },
                    ],
                },
                {
                    type: 'select',
                    name: 'subCategory',
                    label: 'Alt Kategorinizi Seçiniz',
                    placeholder: 'Alt Kategorinizi Seçiniz',
                    selector: '#mat-select-2',
                    options: [
                        { value: 'NEWREQUESTFAMILYVISIT', label: 'AILE ARKADAS ZIYARETI VIZE BASVURUSU / FAMILY FRIEND VISIT VISA APPLICATION' },
                        { value: 'COVID', label: 'EU Family Members - AB Vatandaslari' },
                        { value: 'NEWREQUESTCULTURAL', label: 'KULTUR BILIMSEL VE SANATSAL ETKINLIKLER VIZE BASVURUSU / CULTURAL SCIENTIFIC AND ARTISTIC EVENTS VISA APPLICATION' },
                        { value: 'NEWREQUESTSTUDY', label: 'OGRENCI VIZE BASVURUSU / STUDY VISA APPLICATION' },
                        { value: 'NEWREQUESTDRIVER', label: 'SOFOR VIZE BASVURUSU / DRIVERS VISA APPLICATION' },
                        { value: 'NEWREQUESTBUSINESS', label: 'TICARI VIZE - BUSINESS VISA' },
                        { value: 'NEWREQUESTTOURISM', label: 'TURIZM VIZE BASVURUSU / TOURISM VISA APPLICATION' },
                    ],
                },
                { type: 'button', name: '', label: 'Devam Et', placeholder: '', selector: '' },
            ],
        },
        {
            content: [
                { type: 'text', name: 'firstName', label: 'İsminizi Giriniz', placeholder: 'İsminizi Giriniz', selector: '#mat-input-5', },
                { type: 'text', name: 'lastName', label: 'Soyisminizi Giriniz', placeholder: 'Soyisminizi Giriniz', selector: '#mat-input-6', },
                {
                    type: 'select',
                    name: 'nationality',
                    label: 'Uyruk Seçiniz',
                    placeholder: 'Uyruk Seçiniz',
                    selector: '#mat-select-6',
                    options: [
                        { value: 'turkish', label: 'Türk' },
                        { value: 'german', label: 'Alman' },
                        // Diğer seçenekler
                    ],
                },
                { type: 'text', name: 'passportNumber', label: 'Pasaport Numarası Giriniz', placeholder: 'Pasaport Numarası Giriniz', selector: '#mat-input-7' },
                { type: 'text', name: 'countryCode', label: 'Alan Kodu', placeholder: 'İletişim Numarası Alan Kodunu Giriniz', selector: '#mat-input-8' },
                { type: 'text', name: 'contactNumber', label: 'İletişim Numarası Giriniz', placeholder: 'İletişim Numarası Giriniz', selector: '#mat-input-9' },
                { type: 'email', name: 'email', label: 'E-posta Giriniz', placeholder: 'E-posta Giriniz', selector: '#mat-input-10' },
                { type: 'button', name: '', label: 'Kaydet', placeholder: '', selector: '' },
            ],
        },
        // Diğer adımlar benzer şekilde eklenebilir
    ];
}