import {DataGrid, GridColDef} from "@mui/x-data-grid";
import React from "react";
import {ApiPost} from "@/core/webrequest/controls/webRequest.control";


export interface GridCustomFilterModel{
    RunKey: string;
    FieldName: string;
    FilterValue: any;
    IsString: boolean;
}


interface DataGridControlProps{
    columns: GridColDef[];
    customFilterModel: GridCustomFilterModel | undefined;
    api: string;
    isMongo: boolean
}


export class DataGridControl{

     CurrentPage:number = 0;
     LastSortField:string = "";
     LastFilterVal:string = "";
     FirstId:any = 0;
     LastId:any = 0;
     CheckFirstLoad: boolean = true;
     LastData:any;


    Render = (props: DataGridControlProps) => {

        const [rowCount, setRowCount] = React.useState(50);
        const [rows, setRows] = React.useState([]);
        const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 50, });
        const [filterModel, setFilterModel] = React.useState<any>({ items: [] });
        const [sortModel, setSortModel] = React.useState<any>([]);

        React.useEffect(() => {
            const fetcher = async () => {
                const response = await ApiPost(props.api, {
                    currentPage: this.CurrentPage,
                    page: paginationModel.page,
                    pageSize: paginationModel.pageSize,
                    firstId: this.FirstId,
                    lastId: this.LastId,
                    columns: props.columns,
                    lastSortField: this.LastSortField,
                    checkFirstLoad: this.CheckFirstLoad,
                    lastFilterVal: this.LastFilterVal,
                    customFilter: props.customFilterModel?.RunKey == "-1" ? undefined : props.customFilterModel,
                    sortModel,
                    filterModel,
                    searchQuery: undefined
                });

                if(!response.success){
                    console.log(`Grid data load error >>> ${response.message}`)
                    console.log(`Grid data load error detail >>> ${response.data}`)
                    return;
                }

                const data = response.data.rows
                if(data != undefined && data?.length > 0)
                {
                    this.CheckFirstLoad = false;
                    this.LastSortField = response.data.sortField;
                    this.LastFilterVal = response.data.filterVal;
                    this.FirstId = data[0][this.LastSortField];
                    this.LastId = data[data.length - 1][this.LastSortField];
                    setRows(data);
                }else{
                    this.CheckFirstLoad = true;
                    this.LastSortField = "";
                    this.LastFilterVal = "";
                    this.FirstId = 0;
                    this.LastId = 0;
                }


                this.CurrentPage = response.data.currentPage;
                setRowCount(response.data.rowCount);

                this.LastData = data;
            };
            fetcher();
        }, [paginationModel, sortModel, filterModel]);


        if(props.isMongo){
            return <DataGrid
                rows={rows}
                columns={props.columns}
                rowCount={rowCount}
                getRowId={(row) => row._id}
                pagination
                pageSizeOptions={[50]}
                sortingMode="server"
                filterMode="server"
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onSortModelChange={setSortModel}
                onFilterModelChange={setFilterModel}
            />
        }
        return <DataGrid
            rows={rows}
            columns={props.columns}
            rowCount={rowCount}
            pagination
            pageSizeOptions={[50]}
            sortingMode="server"
            filterMode="server"
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onSortModelChange={setSortModel}
            onFilterModelChange={setFilterModel}
        />
    }

}





export default DataGridControl;