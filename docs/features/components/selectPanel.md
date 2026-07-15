---
outline: 
  - - level: [2, 3]
---

# Select Panel组件

选择勾选内容，支持过滤

## 基础用法

:::demo 单选，支持`v-model:value`
SelectPanel/base
:::

## 多选
:::demo 传入`mutiple`为`true`开启多选，传参`multipleLimit`设置多选个数上限（为0则不限制）
SelectPanel/mutiple
:::

## 手动选择
:::demo 传入`searchKey`进行列表项过滤，可以配合调用`checkAllOrNot`方法全选/全不选和`reverseCheck`方法来反选
SelectPanel/filter
:::

## 禁用
:::demo 组件禁用
SelectPanel/disabled
:::

## 尺寸
:::demo 设置组件尺寸
SelectPanel/size
:::

## 插槽
:::demo 自定义单个选项
SelectPanel/slot
:::

## API

### 属性

| 名称        |      类型      |  说明 |  默认值  |
| ------------- | :----------- | :---- |  :----  |
| modelValue   | SelectValue\<T\>;   |   选中值 |  -  |
| options      | Array\<SelectPanelOption\<T\>\> | 面板列表项 |  []  |
| disabled |   boolean    |    组件是否禁用 | false   |
| multipleLimit |   number    |    多选个数上限 | Infinity   |
| size |   Sizes    |    组件尺寸 | 'default'   |
| emptyText |   string    |    无内容时展示文案 |  '暂无数据'  |

### 插槽

| 名称        |  说明 |  值  |
| ------------- | :---- |  :----  |
| default | 列表子项内容 |   `#default="{ index, data, selected, disabled }"`  |
| emptyText | 无内容时展示内容 |   -  |

### 事件

| 名称        |  说明 |  回调参数  |
| ------------- | :---- |  :----  |
| change | 勾选项变更 |  (val: SelectValue\<T\>, oldVal?: SelectValue\<T\>): void;  |

### 实例方法

| 名称        | 说明 | 类型 |
| ------------- | :---- | :---- |
| checkAllOrNot | 全选/全不选 | (checkAll?: boolean) => void; |
| reverseCheck | 反选 | () => void; |