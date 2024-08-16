

export function FormSerializerControl(formElementId: string) {

    const form: HTMLFormElement = document.getElementById(formElementId) as HTMLFormElement;
    const serialized: Record<string, any> = {}

    for (let i = 0; i < form.elements.length; i++) {

        let field = form.elements[i] as HTMLInputElement | HTMLSelectElement;

        if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

        if (field instanceof HTMLSelectElement) {
            if (field.type === 'select-multiple') {
                for (let n = 0; n < field.options.length; n++) {
                    if (!field.options[n].selected) continue;
                    if(isNaN(parseInt(field.options[n].value))) {
                        serialized[encodeURIComponent(field.name)] = encodeURIComponent(parseInt(field.options[n].value));
                    } else {
                        serialized[encodeURIComponent(field.name)] = encodeURIComponent(field.options[n].value);
                    }
                }
            } else {
                if(!isNaN(parseInt(field.value))) {
                    serialized[encodeURIComponent(field.name)] = parseInt(field.value);
                } else {
                    serialized[encodeURIComponent(field.name)] = encodeURIComponent(field.value);
                }
            }
        }


        if (field instanceof HTMLInputElement) {
            if(field.type === 'checkbox'){
                serialized[encodeURIComponent(field.name)] = field.checked;
            }
            else{
                serialized[encodeURIComponent(field.name)] = encodeURIComponent(field.value);
            }

        }

    }

    return serialized;
}