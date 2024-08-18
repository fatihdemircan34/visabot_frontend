import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState, useCallback } from 'react';
import { DataGridControl } from './dataGridControl';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { debounce } from 'lodash';

export interface GridCustomFilterModel {
  RunKey: string;
  FieldName: string;
  FilterValue: any;
  IsString: boolean;
}

export interface DataGridControlProps {
  filterText?: string;
  columns: GridColDef[];
  customFilterModel?: GridCustomFilterModel;
  customFilterModel2?: GridCustomFilterModel;
  customFilterModel3?: GridCustomFilterModel;
  searchQueryModel?: GridCustomFilterModel[];
  searchQuery?: string;
  api: string;
  isMongo?: boolean;
  isRedis?: boolean;
  [key: string]: any;
}

const DataGridComponent: React.FC<DataGridControlProps> = (props) => {
  const dataGridControl = new DataGridControl();

  const [rowCount, setRowCount] = useState(0);
  const [rows, setRows] = useState<any[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });
  const [filterText, setFilterText] = useState('');
  const [filterModel, setFilterModel] = useState<any>({ items: [] });
  const [sortModel, setSortModel] = useState<any>([]);

  const fetchData = useCallback(async () => {
    let data = { ...props, searchQuery: filterText };

    const { rows, rowCount } = await dataGridControl.fetchData(
      data,
      paginationModel,
      sortModel,
      filterModel
    );
    setRows(rows);
    setRowCount(rowCount);
  }, [filterText, props, paginationModel, sortModel, filterModel]);

  const debouncedFetchData = useCallback(debounce(fetchData, 500), [fetchData]);

  useEffect(() => {
    debouncedFetchData();
    return () => {
      debouncedFetchData.cancel();
    };
  }, [debouncedFetchData]);

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage - 1 }));
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    setPaginationModel((prev) => ({
      ...prev,
      pageSize: event.target.value as number,
      page: 0,
    }));
  };

  return (
    <Box>
      {props.filterText && (
        <div className="row">
          <div className="col-12 d-flex justify-content-center">
            <div className="form-group" style={{ width: '100%' }}>
              <label htmlFor="txtName" className="text-black" style={{fontSize: "1rem"}}>
                Filtre {props.filterText ? `(${props.filterText})` : ''}
              </label>
              <input
                onChange={(e) => setFilterText(e.target.value)}
                value={filterText}
                type="text"
                name="name"
                className="form-control"
                id="txtName"
                aria-describedby="txtNameHelp"
                placeholder="Filtre"
                style={{ color: '#000000' }}
              />
            </div>
          </div>
        </div>
      )}
      <DataGrid
        sx={{ height: 700, width: '100%' }}
        rows={rows}
        columns={props.columns}
        rowCount={rowCount}
        getRowId={
          props.isMongo
            ? (row) => row._id
            : props.isRedis
            ? (row) => row.key
            : undefined
        }
        pageSizeOptions={[50]}
        sortingMode="server"
        filterMode="server"
        disableColumnFilter
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={setSortModel}
        hideFooter
        editMode={undefined}
        
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: { xs: 'center', sm: 'space-between' },
          alignItems: { xs: 'start', sm: 'flex-end' },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <div>Total Elements: {rowCount}</div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'start', sm: 'flex-end' },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <div className="mr-2">Rows per page:</div>
            <Select
              sx={{
                padding: 0,
                '& .MuiSelect-select': {
                  padding: 0,
                },
              }}
              value={paginationModel.pageSize}
              onChange={handlePageSizeChange}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </Box>
          <Pagination
            sx={{
              marginLeft: 2,
              marginTop: 2,
              ' ul': {
                margin: 0,
                mb: 0,
              },
            }}
            count={Math.ceil(rowCount / paginationModel.pageSize)}
            page={paginationModel.page + 1}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DataGridComponent;
