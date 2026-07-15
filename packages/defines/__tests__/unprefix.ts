import type { Unprefix } from '@wdt/defines';

it('严格模式', () => {
  expectTypeOf<Unprefix<{
    'pre/foo': string;
    'pre/bar': number | boolean;
    [key: `pre/${ string }`]: any;
  }, 'pre/'>>().toEqualTypeOf<{
    foo: string;
    bar: number | boolean;
    [K: string]: any;
  }>();

  expectTypeOf<Unprefix<Record<`pre/${ string }`, number>, 'pre/'>>().toEqualTypeOf<Record<string, number>>();
});

it('非严格模式（忽略索引签名）', () => {
  expectTypeOf<Unprefix<{
    'pre/foo': string;
    'pre/bar': number | boolean;
    [key: `pre/${ string }`]: any;
  }, 'pre/', false>>().toEqualTypeOf<{
    foo: string;
    bar: number | boolean;
    [key: `pre/${ string }`]: any;
  }>();
  
  expectTypeOf<Unprefix<Record<`pre/${ string }`, number>, 'pre/', false>>().toEqualTypeOf<Record<`pre/${ string }`, number>>();
});
