import React, {FormEvent, useEffect, useState} from 'react';
import {ProgramObject} from "@/objects/program.object";
import {ApiGet, ApiPost} from "@/core/webrequest/controls/webRequest.control";
import Prompt from "@/pages/app/components/prompt";
import MonacoEditor from "@monaco-editor/react";
import Head from "next/head";
import ModalBox from '@/components/modal/modal-box';
import {useModal} from "@/components/modal/use-modal";
import {FormSerializerControl} from "@/core/webrequest/controls/formSerializer.control";


let CurrentProgram: number = 0;


const Development: React.FC = () => {

    const iPrompt = Prompt();
    const { mboxVisible, mboxTitle, Show, Hide } = useModal();


    const [ProgramData, setProgramData] = useState<ProgramObject[]>([]);
    const [ProgramFilesData, setProgramFilesData] = useState<string[]>([]);
    const [CurrentCode, setCurrentCode] = useState<string>('');
    const [CurrentFile, setCurrentFile] = useState<string>('');
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [IsChanged, setIsChanged] = useState<boolean>(false);
    const [IsProgramSelected, setIsProgramSelected] = useState<boolean>(false);


    useEffect(() => {
        GetPrograms();


        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                SaveCode();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        const handleBeforeUnload = (event: any) => {
            if (IsChanged) {
                event.preventDefault();
                event.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [IsChanged, SaveCode]);

    async function GetPrograms(){
        const resp = await ApiGet('/admin/program/list');
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        setProgramData(resp.data);
    }


    async function LoadProgram(key: any){
        CurrentProgram = Number(key);
        if(CurrentProgram == Number.NaN)
            return;

        const resp = await ApiGet(`/admin/code/files/${key}`);
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }

        setProgramFilesData(resp.data);
        setIsProgramSelected(true);
    }

    async function LoadCode(event: any, fileName:string){
        if(!fileName)
            iPrompt.MessageBoxShow("Hata", "Dosya adı alınamadı!");

        setIsLoading(true);

        if(CurrentFile)
            await SaveCode();

        setCurrentFile(fileName);

        const resp = await ApiPost(`/admin/code/file`, { programKey: CurrentProgram, fileName: fileName });
        setIsLoading(false);

        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }

        const fileElements = document.querySelectorAll('.code-file');
        fileElements.forEach((el) => el.classList.remove('active'));
        if(event)
            event.target.classList.add('active');

        setCurrentCode(`${resp.data}`);
    }


    function GetFileIcon(props: {extension: string}){
        switch (props.extension) {
            case 'json':
                return <i className="mdi mdi-json mr-1"></i>;
            case 'js':
                return <i className="mdi mdi-language-javascript mr-1"></i>;
            case 'html':
                return <i className="mdi mdi-language-html5 mr-1"></i>;
            default:
                return <></>
        }
    }

    function GetFileExtension(filename: string) {
        return filename.split('.').pop();
    }

    function GetLanguageByExtension(extension: string) {
        switch (extension) {
            case 'js':
                return 'javascript';
            case 'json':
                return 'json';
            case 'html':
                return 'html';
            default:
                return 'plaintext';
        }
    }



    async function SaveCode(){
        const resp = await ApiPost(`/admin/code/save`, {
            programKey: CurrentProgram,
            fileName: CurrentFile,
            content: CurrentCode
        });
        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }
        setIsChanged(false);
    }



    function DeleteCodeRequest(){
        iPrompt.ConfirmBoxShow("Kod Silme","Kod sayfası silinecektir. Onaylıyor musunuz?");
    }

    async function DeleteCode(isOk: boolean){
        if(!isOk)
            return;

        if(!CurrentProgram)
            return;

        if(!CurrentFile)
            return;

        const resp = await ApiPost(`/admin/code/delete`, {
            programKey: CurrentProgram,
            fileName: CurrentFile
        });

        if (!resp.success) {
            iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
            return;
        }



        const fileElements = document.querySelectorAll('.code-file');
        fileElements.forEach((el) => el.classList.remove('active'));
        await LoadProgram(CurrentProgram)
        setCurrentFile('');
        setCurrentCode('');
        setIsChanged(false);
    }



    const HandleEditorChange = (value: any) => {
        setCurrentCode(value || '');
        setIsChanged(true);
    };

    const HandleSubmitForNewFile = async (event: FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            setIsLoading(true);
            const resp = await ApiPost(`/admin/code/create`, FormSerializerControl('FileCreateForm'));
            setIsLoading(false);

            if (!resp.success) {
                iPrompt.MessageBoxShow("Hata", resp.message || "Bilinmeyen bir hata oluştu!");
                return;
            }

            await LoadProgram(CurrentProgram);
            await LoadCode(undefined, resp.data)
            document.getElementById(`file_${resp.data}`)?.classList.add('active');

            Hide();
        } catch (error) {
            console.error("Handle Submit For Verify Error: ", error);
        }
    }



    return (<>
        <Head>
            <title>Program Geliştirici - Visa Appointment Engine</title>
        </Head>

        <div className="m-3">
            <div className="row">
                <div className="col-6">
                    <h3>Program Geliştirici</h3>
                </div>
                <div className="col-6">
                    <button className="btn btn-secondary float-right mb-2" type="button" onClick={() => DeleteCodeRequest()}>Kodu Sil</button>
                    <button className="btn btn-danger float-right mb-2 mx-3" type="button" onClick={() => SaveCode()}>Değişiklikleri Kaydet</button>
                    {IsChanged ? <label className="float-right mx-5 mb-3 mt-2" style={{fontSize: 18}}>Kod sayfasında değişiklikler yapıldı!</label> : ""}
                </div>
            </div>
            <div className="row" style={{borderTop: "1px solid #c4c4c4", borderBottom: "1px solid #c4c4c4"}}>
                <div className="col-3" style={{borderRight: "1px solid #c4c4c4"}}>

                    <div className="row">
                        <div className="col-12 mt-2">
                            <h6>Program</h6>
                            <div className="form-group">
                                <select style={{color: '#000000'}} className="form-select form-control" onChange={(e) => LoadProgram(e.target.value)}>
                                    <option selected={true} disabled={true}>Başlamak için lütfen bir program seçiniz.</option>
                                    {(ProgramData?.length || 0) <= 0 ? (<></>) : ProgramData.map(t => <option key={t.key} id={`program_${t.key}`} value={t.key}>{t.name}</option>)}
                                </select>
                                <label style={{display: "block"}} className="text-secondary">Programınız geliştirme ortamına getirilecektir.</label>
                            </div>
                        </div>
                        <div className="col-12">
                            <hr/>
                        </div>
                        <div className="col-12">
                            <h6>Yorumlayıcı</h6>
                        </div>
                        <div className="col-12">
                            {
                                IsProgramSelected ?
                                    (<div className="code-file" onClick={(e) => LoadCode(e, 'scraper.json')}>
                                        <GetFileIcon extension="json"/>
                                        scraper.json
                                    </div>) :
                                    ""
                            }
                        </div>
                        <div className="col-12">
                            <hr/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <h6>Dosya Gezini</h6>
                        </div>
                        <div className="col-6">
                            <div className="float-right" style={{cursor: "pointer", fontSize: 14}} onClick={() => Show("Yeni dosya oluştur.")}>
                                <i className="mdi mdi-file-plus" style={{ fontSize: 16}}></i> Yeni Kod Dosyası
                            </div>
                        </div>
                        <div className="col-12">
                            {(ProgramFilesData?.length || 0) <= 0 ? (<></>) : ProgramFilesData?.map(t => {
                                return (<div key={t} id={`file_${t}`} className="code-file" onClick={(e) => LoadCode(e, t)}>
                                    <GetFileIcon extension={t.split('.').pop() ?? ""}/>
                                    {t}
                                </div>)
                            })}
                        </div>
                    </div>

                </div>
                <div className="col-9 pt-1">
                    {
                        IsLoading ?
                            <>Kod yükleniyor...</> :
                            (<MonacoEditor
                                height="90vh"
                                language={GetLanguageByExtension(GetFileExtension(CurrentFile) ?? "")}
                                value={CurrentCode}
                                onChange={(value) => HandleEditorChange(value)}
                            />)
                    }
                </div>
            </div>
        </div>

        <iPrompt.MessageBox/>
        <iPrompt.ConfirmBox Callback={(res) => DeleteCode(res)}/>
        <ModalBox mboxTitle={mboxTitle} mboxVisible={mboxVisible} Hide={Hide}>
            <form id="FileCreateForm" onSubmit={HandleSubmitForNewFile}>
                <input type="hidden" name="programKey" value={CurrentProgram}/>
                <div className="row">
                    <div className="col-12">
                        <div className="form-group">
                            <span style={{color: '#000000'}}>Dosya Adı</span>
                            <input type="text" name="fileName" className="form-control w-100" style={{color: '#000000'}}/>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="form-group">
                            <span style={{color: '#000000', display: "block"}}>Dosya Uzantısı</span>
                            <select name="fileExtension" style={{color: '#000000'}} className="form-select form-control">
                                <option value="js">Javascript</option>
                                <option value="json">JSON</option>
                                <option value="html">HTML</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-12">
                        <input type="submit" value="Dosya Oluştur" className="btn btn-danger btn-block mb-3"/>
                    </div>
                </div>
            </form>
        </ModalBox>

    </>);
};

export default Development;