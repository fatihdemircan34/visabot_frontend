import React, { useState } from 'react';

export const StepForm = ({ steps }:any) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({});

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleChange = (e:any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const renderStep = (stepContent:any) => {
        return stepContent.map((input:any) => {
            switch (input.type) {
                case 'text':
                case 'email':
                case 'number':
                    return (
                        <div key={input.name} style={{ marginBottom: '10px' }}>
                            <h2>{input.label}</h2>
                            <input
                                type={input.type}
                                name={input.name}
                                placeholder={input.placeholder}
                                value={formData[input.name] || ''}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px' }}
                            />
                        </div>
                    );
                case 'select':
                    return (
                        <div key={input.name} style={{ marginBottom: '10px' }}>
                            <h2>{input.label}</h2>
                            <select
                                name={input.name}
                                value={formData[input.name] || ''}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px' }}
                            >
                                <option value="">{input.placeholder}</option>
                                {input.options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                default:
                    return null;
            }
        });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                {steps.map((_, index) => (
                    <div
                        key={index}
                        style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            backgroundColor: currentStep === index + 1 ? '#000' : '#ccc',
                            color: '#fff',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                        }}
                        onClick={() => setCurrentStep(index + 1)}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>

            {renderStep(steps[currentStep - 1].content)}

            <div style={{ marginTop: '20px' }}>
                {currentStep > 1 && (
                    <button onClick={handlePrevious} style={{ padding: '10px 20px', marginRight: '10px' }}>
                        Geri
                    </button>
                )}
                {currentStep < steps.length && (
                    <button onClick={handleNext} style={{ padding: '10px 20px' }}>
                        İleri
                    </button>
                )}
                {currentStep === steps.length && (
                    <button type="submit" style={{ padding: '10px 20px' }}>
                        Kaydet
                    </button>
                )}
            </div>
        </div>
    );
};
