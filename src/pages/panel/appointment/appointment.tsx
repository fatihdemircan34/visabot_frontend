import React, { useState } from 'react';
import CzechiaForm from './country/czechia-form';
import { EstoniaForm } from './country/estonia-form';
import { FranceForm } from './country/france-form';
const countryForms = {
    czechia: <CzechiaForm />,
    estonia: <EstoniaForm />,
    france: <FranceForm />,
    // Diğer ülkeler için bileşenler eklenebilir
};

const CustomerAdditionPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('');

    const handleAddCustomer = () => {
        setShowForm(true);
    };

    const handleCountryChange = (e:any) => {
        setSelectedCountry(e.target.value);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Randevu Ekleme</h1>

            {!showForm && (
                <button
                    onClick={handleAddCustomer}
                    style={{
                        padding: '15px 30px',
                        fontSize: '18px',
                        borderRadius: '5px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        marginBottom: '20px',
                    }}
                >
                    Müşteri Ekleme
                </button>
            )}

            {showForm && (
                <div>
                    <h2>Ülke Seçimi</h2>
                    <select
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        style={{
                            width: '100%',
                            padding: '15px',
                            fontSize: '18px',
                            borderRadius: '5px',
                            border: '2px solid #ccc',
                            marginBottom: '20px',
                        }}
                    >
                        <option value="" disabled>
                            Bir ülke seçiniz...
                        </option>
                        <option value="czechia">Czechia</option>
                        <option value="estonia">Estonia</option>
                        <option value="france">France</option>
                        {/* Diğer ülkeler için seçenekler */}
                    </select>

                    {selectedCountry && countryForms[selectedCountry]}
                </div>
            )}
        </div>
    );
};

export default CustomerAdditionPage;
