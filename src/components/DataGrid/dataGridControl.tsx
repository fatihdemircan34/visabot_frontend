import { ApiPost } from '@/core/webrequest/controls/webRequest.control';
import { GridCustomFilterModel, DataGridControlProps } from './DataGridComponent';

export class DataGridControl {
  CurrentPage: number = 0;
  LastSortField: string = '';
  LastFilterVal: string = '';
  FirstId: any = 0;
  LastId: any = 0;
  CheckFirstLoad: boolean = true;
  LastData: any;

  async fetchData(
    props: DataGridControlProps,
    paginationModel: any,
    sortModel: any,
    filterModel: any
  ) {
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
      searchQuery: props.searchQuery,
      customFilter:
          props.customFilterModel?.RunKey == '-1'
            ? undefined
            : props.customFilterModel,
      customFilter2:
          props.customFilterModel2?.RunKey == '-1'
              ? undefined
              : props.customFilterModel2,
      sortModel,
      filterModel,
    });

    if (!response.success) {
      console.log(`Grid data load error >>> ${response.message}`);
      console.log(`Grid data load error detail >>> ${response.data}`);
      return { rows: [], rowCount: 0 };
    }

    const data = response.data.rows;
    if (data != undefined && data?.length > 0) {
      this.CheckFirstLoad = false;
      this.LastSortField = response.data.sortField;
      this.LastFilterVal = response.data.filterVal;
      this.FirstId = data[0][this.LastSortField];
      this.LastId = data[data.length - 1][this.LastSortField];
    } else {
      this.CheckFirstLoad = true;
      this.LastSortField = '';
      this.LastFilterVal = '';
      this.FirstId = 0;
      this.LastId = 0;
    }

    this.CurrentPage = response.data.currentPage;

    this.LastData = data;

    return { rows: data, rowCount: response.data.rowCount };
  }
}
