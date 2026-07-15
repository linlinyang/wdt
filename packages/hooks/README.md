# @wdt/hooks

`vue3` Hooks

# 安装

```shell
npm install @wdt/hooks
```

# 使用

```typescript
import { useTable } from 'wdt'

const queryRemoteTableData = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve([{
      id: 1,
      name: 'Jack'
    }])
  }, 1000)
})

const {
  // 表格当前页数据
  tableData,
  // 前端分页表格数据
  localPagingTableData,
  // 表格总条数
  total,
  // 表格数据加载状态
  isLoading,
  // 请求远端表格数据
  query,
  // 重置当前分页、勾选状态后请求远端表格数据
  resetQuery,
  // 表格当前页勾选行
  selection,
  // 当前页
  pageIndex,
  // 当前页尺寸
  pageSize,
  // 分页尺寸列表
  pageSizes,
  // 默认分页尺寸
  initPageSize,
  // 勾选变化事件
  selectionChange
} = useTable(queryRemoteTableData)
```
