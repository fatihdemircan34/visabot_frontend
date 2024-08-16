import { DragEvent, useState } from "react";

export interface FileDropProps{
    callback: (base64: string | ArrayBuffer | null) => void
}

export default function FileDrop(props: FileDropProps) {
    const [isOver, setIsOver] = useState(false);
    const [files, setFiles] = useState<File[]>([]);


    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsOver(false);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsOver(false);

        const droppedFiles = Array.from(event.dataTransfer.files);
        setFiles(droppedFiles);

        droppedFiles.forEach((file) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                props.callback(reader.result);
                // console.log(reader.result);
            };

            reader.onerror = () => {
                console.error("There was an issue reading the file.");
            };

            reader.readAsDataURL(file);
            return reader;
        });
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "175px",
                width: "100%",
                border: "1px dotted #c4c4c4",
                backgroundColor: isOver ? "lightgray" : "white",
            }}
        >
            Yüklenecek dosyayı bu alana bırakabilirsiniz.
        </div>
    );
}
