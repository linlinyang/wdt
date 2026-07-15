# @wdt/components

`vue3`组件库

# 安装

```shell
npm install @wdt/components
```

# 使用

```scss
// 自定义组件主题
// style.scss
@use 'wdt/theme-chalk/index.scss' with (
  $colors: (
    'primary': (
      'base': green
    )
  )
)
```

## 全局引入

TODO: 待完善

## 按需引入
TODO: 按需引入插件待完善

```javascript
// vite.config.ts
export default defineConfig({
  // ...
  css: {
    preprocessorOptions: {
      scss: {
        // 自定义主题
        additionalData: `@use "wdt/theme-chalk/base.scss" with ($colors: ('primary': ('base': green)));`,
      },
    },
  },
});
```

