import { SelectPanel, type SelectPanelInstance, type SelectPanelProps, type SelectPanelOption } from '@wdt/components';
import { render } from 'vitest-browser-vue';
import { h, nextTick, reactive, ref, type Ref } from 'vue';
import type { Mock } from 'vitest';
import { isSimpleType } from '@wdt/utils';

const getRandomOptions = (length: number = 100) => Array(length).fill(0).map((_, index) => index);

const selectPanelTest = (() => {
  const vm = ref<SelectPanelInstance | null>(null);
  const attrs = reactive<SelectPanelProps<number>>({
    options: getRandomOptions(),
    modelValue: 0
  });
  const vmodelFn = vi.fn((a: number) => {
    attrs.modelValue = a;
  });
  const baseRender = {
    render() {
      return h('div', {
        style: {
          height: '300px',
          border: '1px solid #666'
        }
      }, h(SelectPanel as any, {
        ref: vm,
        ...attrs,
        ['onUpdate:modelValue']: vmodelFn,
        onChange: changeCallback,
      }, (slotProp: any) => h('div', {
        'data-testid': slotProp.data,
        title: 'item',
        class: {
          active: slotProp.selected,
          'is-disabled': slotProp.disabled
        }
      }, slotProp.data)));
    }
  };

  /* eslint-disable */
  return it.extend<{
    renderer: any;
    vm: Ref<SelectPanelInstance | null>;
    attrs: SelectPanelProps<number>;
    vmodelFn: Mock<(a: number) => void>;
  }>({
    renderer: async({}, use) => {
      await use(baseRender);
    },
    vm: async({}, use) => {
      await use(vm);
    },
    attrs: async({}, use) => {
      await use(attrs);
    },
    vmodelFn: async({}, use) => {
      await use(vmodelFn);
    }
  });
  /* exlint-enable */
})();

const changeCallback = vi.fn(() => {});

selectPanelTest('基础单选', async ({ renderer, vm, vmodelFn }) => {
  const { getByTestId } = render(renderer);
  expect(vm.value).not.toBeNull();
  await expect.element(getByTestId('0')).toHaveClass('active');
  await getByTestId('1').click();
  expect(vmodelFn).toBeCalledWith(1);
  await expect.element(getByTestId('0')).not.toHaveClass('active');
  await expect.element(getByTestId('1')).toHaveClass('active');
  expect(changeCallback).toBeCalledWith(1, 0);
});

selectPanelTest('基础多选', async ({ renderer, vm, attrs, vmodelFn }) => {
  attrs.mutiple = true;
  // 默认勾选0,
  attrs.modelValue = [0, 1];
  const { getByTestId } = render(renderer);
  expect(vm.value).not.toBeNull();
  await expect.element(getByTestId('0')).toHaveClass('active');
  await expect.element(getByTestId('1')).toHaveClass('active');
  // 增加2勾选
  await getByTestId('2').click();
  expect(vmodelFn).toBeCalledWith([0, 1, 2]);
  expect(changeCallback).toBeCalledWith([0, 1, 2], [0, 1]);
  // 取消1勾选
  await getByTestId('1').click();
  await expect.element(getByTestId('0')).toHaveClass('active');
  await expect.element(getByTestId('1')).not.toHaveClass('active');
  await expect.element(getByTestId('2')).toHaveClass('active');
  expect(vmodelFn).toBeCalledWith([0, 2]);
  expect(changeCallback).toBeCalledWith([0, 2], [0, 1, 2]);
});

const getAllSelectValues = (
  options: SelectPanelOption<number>[] = [],
  initVals: number[] = [],
  excludeVals: number[] = [],
  limit: number = Infinity,
) => options.reduce<number[]>((acc, item) => {
  if (isSimpleType(item)) {
    if (!excludeVals.includes(item) && acc.length < limit) {
      acc.push(item)
    }
  }
  return acc;
}, [...initVals]);

selectPanelTest('多选全选、全不选、反选', async ({ renderer, vm, attrs, vmodelFn }) => {
  const defaultValues = [0, 1];
  attrs.mutiple = true;
  // 默认勾选1,2
  attrs.modelValue = defaultValues;
  // 限制最大勾选10个
  attrs.multipleLimit = 10;
  render(renderer);
  // 全选
  vm.value?.checkAllOrNot();
  // 前十个选中值，[0, 1, 2...9]
  const top10Values = getAllSelectValues(attrs.options, defaultValues, defaultValues, 10);
  expect(vmodelFn).toBeCalledWith(top10Values);
  expect(changeCallback).toBeCalledWith(top10Values, defaultValues);
  // 反选，除前十个外全选，限10个，[10, 11, 12...19]
  vm.value?.reverseCheck();
  const next10Values = getAllSelectValues(attrs.options, [], top10Values, 10);
  expect(vmodelFn).toBeCalledWith(next10Values);
  expect(changeCallback).toBeCalledWith(next10Values, top10Values);
  // 全不选
  vm.value?.checkAllOrNot(false);
  expect(vmodelFn).toBeCalledWith([]);
  expect(changeCallback).toBeCalledWith([], next10Values);

  // 解除limit限制
  attrs.multipleLimit = Infinity;
  attrs.modelValue = [...defaultValues];
  
  await nextTick();
  // 反选，[2, 3, 4...99]
  vm.value?.reverseCheck();
  const excludeVals = getAllSelectValues(attrs.options, [], defaultValues);
  expect(vmodelFn).toBeCalledWith(excludeVals);
  expect(changeCallback).toBeCalledWith(excludeVals, defaultValues);

  // 全选，[2, 3, 4...99, 0, 1]
  vm.value?.checkAllOrNot();
  const allValues = excludeVals.concat(defaultValues);
  expect(vmodelFn).toBeCalledWith(allValues);
  expect(changeCallback).toBeCalledWith(allValues, excludeVals);

  // 全不选
  vm.value?.checkAllOrNot(false);
  expect(vmodelFn).toBeCalledWith([]);
  expect(changeCallback).toBeCalledWith([], allValues);
  expect(vmodelFn).toBeCalledTimes(9)
});

selectPanelTest('禁用状态', async ({ renderer, vm, attrs }) => {
  attrs.disabled = true;
  attrs.modelValue = 0;
  delete attrs.multipleLimit;
  delete attrs.mutiple;
  const { getByTestId } = render(renderer);
  expect(vm.value).not.toBeNull();
  await expect.element(getByTestId('0')).toHaveClass('is-disabled');
  await expect.element(getByTestId('0')).toHaveClass('active');
  await expect.element(getByTestId('11')).toHaveClass('is-disabled');
  // 禁用状态，单选切换无效
  await getByTestId('1').click();
  await expect.element(getByTestId('1')).not.toHaveClass('active');
  // 多选也无效
  attrs.mutiple = true;
  attrs.modelValue = [0];
  await expect.element(getByTestId('0')).toHaveClass('is-disabled');
  await expect.element(getByTestId('0')).toHaveClass('active');
  await expect.element(getByTestId('11')).toHaveClass('is-disabled');
  // 勾选其他节点也无效
  await getByTestId('1').click();
  await expect.element(getByTestId('1')).not.toHaveClass('active');
});
