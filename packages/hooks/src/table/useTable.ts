import { cloneDeep, isNil } from 'lodash-es';
import {
  ref,
  computed,
  shallowRef,
  type ComputedRef,
  type Ref,
  type ShallowRef,
  type UnwrapRef,
} from 'vue';
import { Awaitable } from '@wdt/defines';

// 分页表格数据
export type PaginationTableData<T> = {
  total?: number;
  tableData: UnwrapRef<T[]>;
} | UnwrapRef<T[]>;

// 请求远端表格数据参数
export interface RequestTablePageParams {
  pageIndex: number;
  pageSize: number;
}

// 请求远端表格数据方法
export type RequestTableFn<T, P extends unknown[] = []> = (
  this: void,
  requestParams: RequestTablePageParams,
  ...args: P
) => Awaitable<PaginationTableData<T> | null | undefined>;

// 默认表格分页尺寸
const defaultInitPageSize = 10;
// 默认分页尺寸列表
const defaultPageSizes = [10, 20, 50, 100];

// 生成表格参数
export interface TablePageOptions {
  initPageSize?: number;
  initPageSizes?: Array<number | string>;
}

// 表格响应式数据类型
interface TableRefProps<T> {
  tableData: Ref<UnwrapRef<T[]>>;
  total: Ref<number>;
  isLoading: Ref<boolean>;
  selection: ShallowRef<T[]>;
  pageIndex: Ref<number>;
  pageSize: Ref<number>;
  pageSizes: Ref<Array<number | string>>;
  initPageSize: number;
}

/**
 * 定义表格公共属性
 * @param options 初始化参数
 */
export const useTableDefines = <T>(options?: TablePageOptions): TableRefProps<T> => {
  // 表格数据
  const tableData = ref<T[]>([]);
  // 分页总数
  const total = ref<number>(0);
  // 是否加载中
  const isLoading = ref<boolean>(false);
  // 当前表格勾选项
  const selection = shallowRef<T[]>([]);
  // 分页当前页
  const pageIndex = ref<number>(1);
  // 初始化分页尺寸
  const initPageSize = options?.initPageSize ?? defaultInitPageSize;
  // 分页当前页尺寸
  const pageSize = ref<number>(initPageSize);
  // 分页尺寸列表
  const pageSizes = ref<Array<number | string>>(options?.initPageSizes ?? defaultPageSizes);

  return {
    tableData,
    total,
    pageIndex,
    pageSize,
    isLoading,
    selection,
    pageSizes,
    initPageSize,
  };
};

type SelectionChangeFn<T> = (rows: T[]) => void;
// 生成更新selection函数
const useSelectionChange = <T>(selection: Ref<T[]>): SelectionChangeFn<T> => (rows: T[]) => {
  selection.value = cloneDeep(rows);
};

type QueryTableTableFn<P extends unknown[]> = (...agrs: P) => Promise<void>;
/**
 * 生成发起请求远端数据函数
 * @param fn 请求函数
 * @param tableRefProps 表格响应式数据
 */
const useQueryTableData = <T, P extends unknown[] = []>(
  fn: RequestTableFn<T, P>,
  tableRefProps: TableRefProps<T>,
): QueryTableTableFn<P> => async (...args: P) => {
  const {
    pageIndex,
    pageSize,
    isLoading,
    total,
    tableData,
  } = tableRefProps;
  let dataSource: UnwrapRef<T[]> = [];
  let acount: number = 0;
  isLoading.value = true;
  try {
    // 请求远端获取表格数据
    const pageModel = await fn({
      pageIndex: pageIndex.value,
      pageSize: pageSize.value,
    }, ...args);

    if (!isNil(pageModel)) {
      dataSource = Array.isArray(pageModel) ? pageModel : pageModel.tableData;
      acount = Array.isArray(pageModel) ? dataSource.length : (pageModel.total ?? dataSource.length);
    }
  } finally {
    isLoading.value = false;
    tableData.value = dataSource;
    total.value = acount;
  }
};

const useResetQuery = <T, P extends unknown[] = []>(
  query: QueryTableTableFn<P>,
  tableRefProps: TableRefProps<T>,
): QueryTableTableFn<P> => (...args: P) => {
  const {
    tableData,
    pageSize,
    pageIndex,
    initPageSize,
    selection,
  } = tableRefProps;
  // 清除表格当前状态并查询数据
  tableData.value = [];
  pageIndex.value = 1;
  pageSize.value = initPageSize;
  selection.value = [];
  return query(...args);
};

// 本地前端分页数据
const localPagingTableDataGetter = <T>(tableRefProps: TableRefProps<T>): UnwrapRef<T[]> => {
  const {
    tableData,
    pageIndex,
    pageSize,
  } = tableRefProps;
  const startIndex = (pageIndex.value - 1) * pageSize.value;
  const endIndex = pageIndex.value * pageSize.value;

  return tableData.value.slice(startIndex, endIndex);
};

interface TableProps<T, P extends unknown[] = []> extends TableRefProps<T> {
  selectionChange: SelectionChangeFn<T>;
  query: QueryTableTableFn<P>;
  resetQuery: QueryTableTableFn<P>;
  localPagingTableData: ComputedRef<UnwrapRef<T[]>>;
}
/**
 * 抽象请求表格接口
 * 生成表格公共属性及方法
 * @param fn 请求远端表格数据方法
 * @param options 生成表格分页初始化参数
 * 
 * @example
 * 
 * const {
 *  tableData,
 *  total,
 *  pageIndex,
 *  pageSize,
 *  isLoading,
 *  selection,
 *  localPagingTableData,
 *  selectionChange,
 *  query,
 *  resetQuery,
 *  pageSizes,
 *  initPageSize,
 * } = useTable(fetchRemotePageTableData, {
 *  initPageSize: 10,
 *  initPageSizes: [10, 20, 30]
 * });
 */
export const useTable = <T, P extends unknown[] = []>(
  fn: RequestTableFn<T, P>,
  options?: TablePageOptions,
): TableProps<T, P> => {
  // 表格及分页响应式数据
  const tableRefProps = useTableDefines<T>(options);
  // 请求表格远端数据
  const query = useQueryTableData(fn, tableRefProps);

  return {
    ...tableRefProps,
    // 请求远端表格数据
    query,
    // 重置分页数据及其他状态后，请求更新表格数据
    resetQuery: useResetQuery(query, tableRefProps),
    // 前端分页表格数据
    localPagingTableData: computed(() => localPagingTableDataGetter(tableRefProps)),
    // 表格勾选切换
    selectionChange: useSelectionChange(tableRefProps.selection),
  };
};
