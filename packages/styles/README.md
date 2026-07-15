# @wdt/styles

scss公共样式及公共方法封装

# 安装

```shell
npm install @wdt/styles
```

# 使用

## vite全局使用

``` typescript
defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@wdt/styles" as *;'
      }
    }
  }
});
```

## 直接使用

创建全局样式`scss`文件
``` scss
// index.scss
@forward "@wdt/styles";
```

在vue文件中直接使用
```vue
<tmeplate></tmeplate>
<style lang="scss" scoped>
@use "./index.scss" as *;

// 或自定义主题色
@use "./index.scss" as * with($themeColor: red);
</style>
```
