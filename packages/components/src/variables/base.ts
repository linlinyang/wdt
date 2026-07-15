import type {
  sizes,
} from './contents';

// 滚动方向
export type Direction = 'vertical' | 'horizontal';
// 滚动目标元素在可视区的位置
export type Align = 'start' | 'center' | 'end';
// 组件尺寸列表
export type Sizes = typeof sizes[number];

// 基本数据类型
export type Key = string | number | symbol;
