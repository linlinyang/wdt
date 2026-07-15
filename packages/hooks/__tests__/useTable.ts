import {
  useTable,
  type RequestTablePageParams,
  type PaginationTableData
} from '@wdt/hooks';

interface TableRow {
  id: number;
}
const mockTotal = 100;
const mockFullTableData: TableRow[] = Array.from({ length: mockTotal }, (_, i) => ({
  id: i + 1,
}));

const mockFetchPageTableData = ({
  pageIndex = 1,
  pageSize = 10,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
}: RequestTablePageParams, ...args: any[]) => new Promise<PaginationTableData<TableRow>>((resolve) => {
  setTimeout(() => {
    resolve({
      total: mockTotal,
      tableData: mockFullTableData.slice((pageIndex - 1) * pageSize, pageIndex * pageSize),
    });
  }, 300);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockFetchLocalTableData = (_: RequestTablePageParams, ...args: any[]) => new Promise<PaginationTableData<TableRow>>((resolve) => {
  setTimeout(() => {
    resolve({
      tableData: mockFullTableData,
    });
  }, 200);
});

const fetchPageTableData = vi.fn(mockFetchPageTableData);
const fetchLocalTableData = vi.fn(mockFetchLocalTableData);
const {
  tableData,
  total,
  pageIndex,
  pageSize,
  isLoading,
  selection,
  localPagingTableData,
  query,
  resetQuery,
  pageSizes,
  initPageSize,
} = useTable(fetchPageTableData);

it('初始化属性', () => {
  expect(tableData.value).toEqual([]);
  expect(total.value).toEqual(0);
  expect(pageIndex.value).toEqual(1);
  expect(pageSize.value).toEqual(initPageSize);
  expect(initPageSize).toEqual(10);
  expect(isLoading.value).toEqual(false);
  expect(selection.value).toEqual([]);
  expect(localPagingTableData.value).toEqual([]);
  expect(pageSizes.value).toEqual([10, 20, 50, 100]);
});

it('远端分页', async () => {
  pageIndex.value = 2;
  pageSize.value = 20;
  vi.useFakeTimers();
  query(1, '2', true).then(() => {
    expect(isLoading.value).toEqual(false);
    expect(total.value).toEqual(mockTotal);
    expect(tableData.value.length).toEqual(20);
    expect(fetchPageTableData).toHaveBeenCalledWith({ pageIndex: 2, pageSize: 20 }, 1, '2', true);
    expect(localPagingTableData.value.length).toEqual(0);
    expectTypeOf(tableData.value).toEqualTypeOf<TableRow[]>();
    vi.useRealTimers();
  });
  expect(isLoading.value).toEqual(true);
  vi.runAllTimers();
});

it('远端分页：resetquery', () => {
  // mock 勾选数据
  selection.value = [{id: 1}];
  vi.useFakeTimers();
  resetQuery('queryFromReset').then(() => {
    expect(isLoading.value).toEqual(false);
    expect(tableData.value.length).toEqual(initPageSize);
    expect(fetchPageTableData).toHaveBeenCalledWith({ pageIndex: 1, pageSize: initPageSize }, 'queryFromReset');
    vi.useRealTimers();
  });
  expect(isLoading.value).toEqual(true);
  expect(pageIndex.value).toEqual(1);
  expect(pageSize.value).toEqual(initPageSize);
  expect(selection.value).toEqual([]);
  vi.runAllTimers();
});

const {
  tableData: localTableData,
  total: localTotal,
  pageIndex: localPageIndex,
  pageSize: localPageSize,
  isLoading: localIsLoading,
  localPagingTableData: localLocalPagingTableData,
  query: localQuery,
} = useTable(fetchLocalTableData);
it('前端分页', () => {
  localPageIndex.value = 3;
  localPageSize.value = 10;
  vi.useFakeTimers();
  localQuery(1, '2', true).then(() => {
    expect(localIsLoading.value).toEqual(false);
    expect(localTotal.value).toEqual(mockTotal);
    expect(localTableData.value.length).toEqual(mockTotal);
    expect(fetchLocalTableData).toHaveBeenCalledWith({ pageIndex: 3, pageSize: 10 }, 1, '2', true);
    expect(localLocalPagingTableData.value.length).toEqual(10);
    expectTypeOf(localTableData.value).toEqualTypeOf<TableRow[]>();
    vi.useRealTimers();
  });
  expect(localIsLoading.value).toEqual(true);
  vi.runAllTimers();
});