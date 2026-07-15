import type { Direction, Align } from '@wdt/components';

// 组件属性
export interface Props<T = any> {
  // 虚拟滚动列表数据
  listData: T[];
  // 滚动方向
  direction?: Direction;
  // 可视窗内展示的首条元素下标
  index?: number;
  // 平均子元素占据空间
  arerageSpace?: number;
}

// 组装虚拟元素属性
export interface VirtualItem<T = any> {
  index: number;
  data: T;
}

// 组件实例
export interface VirtualScrollInstance {
  scrollToIndex: (index: number, align?: Align) => Promise<void>;
}
