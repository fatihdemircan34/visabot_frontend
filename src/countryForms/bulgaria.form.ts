import { CountryStepsInterface } from "@/interfaces/countrySteps.interface";

export class BulgariaForm implements CountryStepsInterface {
    Steps = [
        {
            content: [
                {
                    type: 'select',
                    name: 'visaCenter',
                    label: 'Vize Başvuru Merkezinizi Seçiniz',
                    placeholder: 'Vize Başvuru Merkezinizi Seçiniz',
                    options: [
                        { value: 'Sofia', label: 'Bulgaristan Vize Başvuru Merkezi - Sofya' },
                        { value: 'Plovdiv', label: 'Bulgaristan Vize Başvuru Merkezi - Plovdiv' },
                        { value: 'Varna', label: 'Bulgaristan Vize Başvuru Merkezi - Varna' },
                        { value: 'Burgas', label: 'Bulgaristan Vize Başvuru Merkezi - Burgaz' },
                    ],
                },
                {
                    type: 'select',
                    name: 'applicationCategory',
                    label: 'Başvuru Kategorinizi Seçiniz',
                    placeholder: 'Başvuru Kategorinizi Seçiniz',
                    options: [
                        { value: 'short-term', label: 'KISA DONEM VIZE BASVURUSU / SHORT TERM VISA APPLICATION' },
                        { value: 'long-term', label: 'UZUN DONEM VIZE BASVURUSU / LONG TERM VISA APPLICATION' },
                    ],
                },
                {
                    type: 'select',
                    name: 'subCategory',
                    label: 'Alt Kategorinizi Seçiniz',
                    placeholder: 'Alt Kategorinizi Seçiniz',
                    options: [
                        { value: 'NEWREQUESTFAMILYVISIT', label: 'AILE ARKADAS ZIYARETI VIZE BASVURUSU / FAMILY FRIEND VISIT VISA APPLICATION' },
                        { value: 'NEWREQUESTBUSINESS', label: 'TICARI VIZE - BUSINESS VISA' },
                        { value: 'NEWREQUESTTOURISM', label: 'TURIZM VIZE BASVURUSU / TOURISM VISA APPLICATION' },
                    ],
                },
            ],
        },
        {
            content: [
                { type: 'text', name: 'firstName', label: 'İsminizi Giriniz', placeholder: 'İsminizi Giriniz' },
                { type: 'text', name: 'lastName', label: 'Soyisminizi Giriniz', placeholder: 'Soyisminizi Giriniz' },
                {
                    type: 'select',
                    name: 'nationality',
                    label: 'Uyruk Seçiniz',
                    placeholder: 'Uyruk Seçiniz',
                    options: [
                        { value: 'turkish', label: 'Türk' },
                        { value: 'german', label: 'Alman' },
                        // Diğer seçenekler
                    ],
                },
                { type: 'text', name: 'passportNumber', label: 'Pasaport Numarası Giriniz', placeholder: 'Pasaport Numarası Giriniz' },
                { type: 'text', name: 'contactNumber', label: 'İletişim Numarası Giriniz', placeholder: 'İletişim Numarası Giriniz' },
                { type: 'email', name: 'email', label: 'E-posta Giriniz', placeholder: 'E-posta Giriniz' },
            ],
        },
        // Diğer adımlar benzer şekilde eklenebilir
    ];
}
