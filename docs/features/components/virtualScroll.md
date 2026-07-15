---
outline: 
  - - level: [2, 3]
---

# 虚拟滚动组件

支持数十万甚至百万级不定高度列表项滚动组件

## 基础用法

:::demo 通过传入`listData`数组设置滚动项，可见视窗高度为父元素高度
VirtualScroll/base
:::

## 双向绑定index

:::demo 参数`index`为视窗内第一个元素下标，支持`v-model:index`
VirtualScroll/model
:::

## 自定义滚动项

:::demo 默认插槽可获取`index`和`data`属性，`index`为当前滚动项下标，`data`为当前滚动项原始数据。
VirtualScroll/slot
:::

## 水平滚动

:::demo 参数`direction`默认为`vertical`（垂直）方向滚动，可设置为`horizontal`（水平）方向滚动
VirtualScroll/direction
:::

## 滚动至指定项

:::demo 调用实例方法`scrollToIndex(index, align = 'start')`可滚动至目标下标
VirtualScroll/scroll
:::

## API

### 属性

| 名称        |      类型      |  说明 |  默认值  |
| ------------- | :----------- | :---- |  :----  |
| listData      |   Array\<any\>    |   滚动项数组 |  []  |
| index      | number | 视窗内第一条滚动项下标 |  -  |
| direction |   'vertical'\|'horizontal'    |    滚动方向 | vertical   |
| arerageSpace |   number    |    平均滚动项占据空间，为了优化计算滚动列表，一般不传 | 10   |

### 插槽

| 名称        |  说明 |  值  |
| ------------- | :---- |  :----  |
| default | 默认插槽内容 |   `#default="{ index, data }"`  |

### 事件

| 名称        |  说明 |  回调参数  |
| ------------- | :---- |  :----  |
| virtual-scroll | 滚动 |  视窗内滚动项起止下标数组`[startIndex, endIndex]`  |

### 实例方法

| 名称        | 说明 | 参数 |
| ------------- | :---- | :---- |
| scrollToIndex | 滚动至指定项 | 一个参数`index:number`为目标项下标，第二个参数`align:string = start\|center\|end`为指定项相对视窗位置 |
