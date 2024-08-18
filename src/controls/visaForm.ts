export type VisaOption = {
    value: string;
    label: string;
};
export type VisaFormField = {
    type: string;
    name: string;
    label: string;
    placeholder: string;
    options?: VisaOption[];
};

export type VisaFormStep = {
    content: VisaFormField[];
};


export class VisaForm {
    steps: VisaFormStep[];

    constructor(steps: VisaFormStep[]) {
        this.steps = steps;
    }

    static fromJSON(json: any): VisaForm {
        const steps: VisaFormStep[] = json.map((step: any) => {
            const content: VisaFormField[] = step.content.map((field: any) => ({
                type: field.type,
                name: field.name,
                label: field.label,
                placeholder: field.placeholder,
                options: field.options || [],
            }));

            return { content };
        });

        return new VisaForm(steps);
    }
}