import { VirtualScroll } from '@wdt/components';
import { h } from 'vue';
import { render } from 'vitest-browser-vue';

const containerHeight = 480;
const itemHeight = 24;
const demoRenderer = {
  render() {
    return h('div', {
      class: 'demo',
      style: {
        width: '300px',
        height: `${containerHeight}px`,
        border: '1px solid #666',
      }
    }, h(VirtualScroll as any, {
      listData: Array(1000).fill(0).map((_, index) => index),
      'data-testid': 'virtualScroll',
    }, (slotProp: any) => h('div', {
      style: {
        height: `${itemHeight}px`,
        lineHeight: `${itemHeight}px`,
      },
      'data-testid': slotProp.data,
      title: 'vir-item'
    }, slotProp.data)));
  }
};

it('虚拟滚动渲染', async () => {
  const perPage = containerHeight / itemHeight;
  const buffSize = perPage >> 1;
  const { getByTitle, getByTestId, baseElement } = render(demoRenderer);
  await expect.element(getByTestId('virtualScroll')).toBeInTheDocument();
  await expect.element(getByTitle('vir-item').nth(perPage + buffSize - 1)).toBeInTheDocument();
  baseElement.querySelectorAll('.wdt-virtual-scroll__item')[buffSize].scrollIntoView();
  await expect.element(getByTitle('vir-item').first()).toContainHTML('0');
  await expect.element(getByTitle('vir-item').last()).toContainHTML('39');
  baseElement.querySelector('.wdt-virtual-scroll')?.scrollTo({
    top: 15 * itemHeight
  });
  await expect.element(getByTestId('15')).toBeInTheDocument();
  await expect.element(getByTitle('vir-item').first()).toContainHTML('5');
  await expect.element(getByTitle('vir-item').last()).toContainHTML('44');
});