import React, { useState } from 'react';
import {VisaFormField, VisaForm} from "@/controls/visaForm";

const FormRenderer = (props: {Steps: any, FormSave:(formData: Record<string, any>) => Promise<void>, Dataset?: any}) => {

    const Steps = props.Steps;
    let currentData = {}
    if(props.Dataset != undefined){
        const dataset = JSON.parse(props.Dataset)
        VisaForm.fromJSON(Steps).steps?.map(c => {
            c.content?.map(t => {
                currentData = {
                    ...currentData,
                    [t.name]: dataset[t.name as string],
                }
            });
        });
    }


    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Record<string, any>>(currentData);

    const handleNext = () => {
        if (currentStep < Steps.length) {
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




    const renderStep = (stepContent: VisaFormField[]) => {

        return stepContent?.map((input) => {

            switch (input.type) {
                case 'text':
                case 'email':
                case 'number':
                    return (<div className={`${props.Dataset == undefined ? 'col-7' : 'col-6'} mt-1`}>
                        <div className="form-group">
                            <label className="h6">{input.label}</label>
                            <input type={input.type} name={input.name} placeholder={input.placeholder} value={formData[input.name] || ''}
                                onChange={handleChange} style={{color: '#000000'}} className="form-control" />
                        </div>
                    </div>);
                case 'select':
                    return (<div className={`${props.Dataset == undefined ? 'col-7' : 'col-6'} mt-1`}>
                        <div className="form-group">
                            <label className="h6">{input.label}</label>
                            <select name={input.name} value={formData[input.name as string] || ''} onChange={handleChange} style={{color: '#000000'}} className="form-select form-control">
                                <option value="">{input.placeholder}</option>
                                {input.options?.map((option: any) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>);
                default:
                    return null;
            }
        });
    };

    return (
        <div className={`row ${props.Dataset == undefined ? 'd-flex justify-content-center' : ''}`}>
            <div className={`${props.Dataset == undefined ? 'col-7' : 'col-12'}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    {
                        Steps.map((_: any, index: any) => (<div
                            key={index}
                            style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: currentStep === index + 1 ? '#000' : '#ccc', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', }}
                            onClick={() => setCurrentStep(index + 1)} >
                            {index + 1}
                        </div>))
                    }
                </div>
            </div>

            {renderStep(VisaForm.fromJSON(Steps).steps[currentStep - 1]?.content)}

            <div className={`${props.Dataset == undefined ? 'col-7' : 'col-12'} mt-5`}>

                {currentStep > 1 &&
                    (<button onClick={handlePrevious} className="btn btn-secondary">
                        Geri
                    </button>)}
                {currentStep < Steps.length &&
                    (<button onClick={handleNext} className="btn btn-danger float-right">
                        İleri
                    </button>)}
                {currentStep === Steps.length &&
                    (<button type="button" className="btn btn-danger float-right" onClick={() => props.FormSave(formData)}>
                        Kaydet
                    </button>)}

            </div>
        </div>


    );
};

export default FormRenderer;
