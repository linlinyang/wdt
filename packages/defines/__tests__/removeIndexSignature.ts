import { type RemoveIndexSignature } from '@wdt/defines';

it('常见功能', () => {
  expectTypeOf<RemoveIndexSignature<{
    foo: string;
    bar: () => void;
    baz: number | boolean;
    [key: string]: any;
  }>>().toEqualTypeOf<{
    foo: string;
    bar: () => void;
    baz: number | boolean;
  }>();
});

it('record类型', () => {
  expectTypeOf<RemoveIndexSignature<Record<string, number>>>().toEqualTypeOf<{}>();
});
