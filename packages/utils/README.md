# @wdt/utils

抽象公共方法

# 安装

```shell
npm install @wdt/utils
```

# 使用

``` typescript
import { isSimpleType } from "@wdt/utils";

isSimpleType('');
// => true

isSimpleType(123);
// => true

isSimpleType(true);
// => true

isSimpleType(Symbol(''));
// => true

isSimpleType(BigInt(1111));
// => true

isSimpleType([]);
// => false

```