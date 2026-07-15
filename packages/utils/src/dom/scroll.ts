// 当前环境是否支持“scrollend”事件
export const isScrollEndSupport = 'onscrollend' in window;

/**
 * 当前环境支持scrollend事件则使用之
 * 不支持则使用scroll代替实现
 */
const scrollEventName = isScrollEndSupport ? 'scrollend' : 'scroll';

/**
 * 校验元素是否滚动至目标位置
 * @param el 滚动元素
 * @param arg 水平,垂直滚动距离对象
 */
function isScrollToEnd(el: Element, arg?: ScrollToOptions): boolean;
/**
 * 校验元素是否滚动至目标位置
 * @param el 滚动元素
 * @param x 水平轴滚动距离
 * @param y 垂直轴滚动距离
 */
function isScrollToEnd(el: Element, x: number, y: number): boolean;
function isScrollToEnd(el: Element, arg?: ScrollToOptions | number, y?: number): boolean {
  const {
    scrollHeight,
    scrollWidth,
    clientWidth,
    clientHeight,
    scrollTop,
    scrollLeft,
  } = el;
  const isNumArg = typeof arg === 'number';
  const left = Math.floor((isNumArg ? arg : arg?.left) ?? scrollLeft);
  const top = Math.floor((isNumArg ? y : arg?.top) ?? scrollTop);
  const maxScrollTop = scrollHeight - clientHeight;
  const maxScrollLeft = scrollWidth - clientWidth;
  // 限制目标滚动距离
  // 超出最大滚动距离则认为滚动至目标位置
  const targetLeft = Math.min(left, maxScrollLeft);
  const targetTop = Math.min(top, maxScrollTop);

  return targetLeft <= scrollLeft && targetTop <= scrollTop;
}

/**
 * 原生scrollTo方法无法检测滚动结束;
 * 封装元素srcollTo方法，返回promise
 * @param el 滚动元素
 * @param options 水平,垂直滚动距离对象
 */
export function futureScrollTo(el: Element, options?: ScrollToOptions): Promise<Event | undefined>;
/**
 * @param el 滚动元素
 * @param x 水平轴滚动距离
 * @param y 垂直轴滚动距离
 */
export function futureScrollTo(el: Element, x: number, y: number): Promise<Event | undefined>;
export function futureScrollTo(el: Element, arg?: ScrollToOptions | number, y?: number): Promise<Event | undefined> {
  const isNumArg = typeof arg === 'number';
  return new Promise<Event | undefined>((resolve) => {
    // 判断是否滚动至目标距离
    const onScroll = (e?: Event) => {
      const isScrollEnd = isScrollEndSupport || (isNumArg ? isScrollToEnd(el, arg, y!) : isScrollToEnd(el, arg));
      if (isScrollEnd) {
        el.removeEventListener(scrollEventName, onScroll);
        resolve(e);
      }
    };
    el.addEventListener(scrollEventName, onScroll);
    // 默认判断一次
    onScroll();

    // jsdom不支持触发滚动事件，无法测试
    if (isNumArg) {
      el.scrollTo(arg, y!);
    } else {
      el.scrollTo(arg);
    }
  });
}
