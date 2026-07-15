# 基于vue3生态的前端开发工具库

## 项目介绍

使用当前最新版本的前端工具及框架构建vue前端开发相关的工具库，包括但不限于：
1. 补充组件（虚拟滚动等）
2. 补充vue`hooks`
3. 补充指令
4. 补充插件
5. scss方法复用
6. ts类型定义

## 项目优势

1. 使用高性能包管理工具`pnpm`
2. 使用`monorepo`单仓模式管理代码库
3. 集成单元测试和UI测试
4. 完善的ts类型提示

## 快速入门

直接clone当前项目或者下载zip文件

1. clone当前项目
2. 进入当前项目根目录，执行`npm run build`后`npm link`
3. 切换至开发项目，执行`npm link wdt`
4. 引入组件`import { VirtualScroll } from 'wdt';import 'wdt/theme/virtual-scroll.css';`
5. 引入方法`import { isSimpleType } from 'wdt';`
6. 引入scss`@use 'wdt/styles' as *;.demo {@include text-ellipsis();}`

## 更多

更多功能及开发文档，请运行`npm run docs`查看

## 帮助

更多问题请联系`杨林林 30020549`