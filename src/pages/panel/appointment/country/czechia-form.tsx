import React from 'react';
import { StepForm } from '../country-forms';


const CzechiaForm = () => {
    const steps = [
        {
            content: [
                {
                    type: 'select',
                    name: 'visaCenter',
                    label: 'Vize Başvuru Merkezinizi Seçiniz',
                    placeholder: 'Vize Başvuru Merkezinizi Seçiniz',
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
                    options: [
                        { value: 'short-term', label: 'KISA DONEM VIZE BASVURUSU / SHORT TERM VISA APPLICATION' },
                    ],
                },
                {
                    type: 'select',
                    name: 'subCategory',
                    label: 'Alt Kategorinizi Seçiniz',
                    placeholder: 'Alt Kategorinizi Seçiniz',
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

    return (
        <div>
            <h2>Czechia Form</h2>
            <StepForm steps={steps} />
        </div>
    );
};

export default CzechiaForm;
