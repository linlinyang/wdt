# @wdt/defines

ts类型公共方法

# 安装

```shell
npm install @wdt/defines
```

# 使用

``` typescript
import type { Prefix } from "@wdt/defines";

type Foo = Prefix<{
  foo: string;
  bar: number | boolean;
  [key: string]: any;
}, "pre/">;
// => { "pre/foo": string; "pre/bar": number | boolean; [key: `pre/${ string }`]: any; }

```