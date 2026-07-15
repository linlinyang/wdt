import type { Prefix } from '@wdt/defines';

it('严格模式', () => {
  expectTypeOf<Prefix<{
    foo: string;
    bar: number | boolean;
    [key: string]: any;
  }, 'pre/'>>().toEqualTypeOf<{
    'pre/foo': string;
    'pre/bar': number | boolean;
    [key: `pre/${ string }`]: any;
  }>();

  expectTypeOf<Prefix<Record<string, number>, 'pre/'>>().toEqualTypeOf<Record<`pre/${ string }`, number>>();
});

it('非严格模式（忽略索引签名）', () => {
  expectTypeOf<Prefix<{
    foo: string;
    bar: number | boolean;
    [key: string]: any;
  }, 'pre/', false>>().toEqualTypeOf<{
    'pre/foo': string;
    'pre/bar': number | boolean;
    [key: string]: any;
  }>();
  
  expectTypeOf<Prefix<Record<string, number>, 'pre/', false>>().toEqualTypeOf<Record<string, number>>();
});
