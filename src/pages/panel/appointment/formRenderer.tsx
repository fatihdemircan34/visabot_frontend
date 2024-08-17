
"use client";
import React, {useState} from 'react';

export const FormRenderer = ({ config } : any) => {
    const [formData, setFormData] = useState({});

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
        });
    };

    const renderField = (field: any, idx: any) => {
        switch (field.type) {
            case 'text':
                return (
                    <div key={idx}>
                        <label>{field.label}</label>
                        <input
                            type="text"
                            name={field.label.toLowerCase()}
                            placeholder={field.placeholder}
                            onChange={handleChange}
                            required={field.required}
                        />
                    </div>
                );
            case 'select':
                return (
                    <div key={idx}>
                        <label>{field.label}</label>
                        <select name={field.label.toLowerCase()} onChange={handleChange} required={field.required}>
                            {field.options.map((option: any, index: any) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            case 'checkbox':
                return (
                    <div key={idx}>
                        <label>
                            <input
                                type="checkbox"
                                name={field.label.toLowerCase()}
                                onChange={handleChange}
                                required={field.required}
                            />
                            {field.label}
                        </label>
                    </div>
                );
            default:
                return null;
        }
    };
    

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log('Form Data:', formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {config.fields.map((field: any, idx: any) => renderField(field, idx))}
            <button type="submit">Submit</button>
        </form>
    );
};