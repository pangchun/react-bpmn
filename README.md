

<p align="center">
  <a href="https://github.com/pangchun/react-bpmn">
   <img src='assets/react-bpmn.png' alt='logo' />
  </a>
</p>


<h1 align="center">React Bpmn</h1>



<p align="center">
<img alt="GitHub stars" src="https://img.shields.io/github/stars/pangchun/react-bpmn?style=flat&logo=github" />
<img alt="GitHub stars" src="https://img.shields.io/github/forks/pangchun/react-bpmn?style=flat&logo=github" />
<img src='https://gitee.com/zhangqianchun/react-bpmn/badge/star.svg?theme=dark' alt='star' />
<img src='https://gitee.com/zhangqianchun/react-bpmn/badge/fork.svg?theme=dark' alt='fork' />
</p>
<p align="center">
<img src="https://img.shields.io/badge/react-^18.0.12-blueviolet" alt="" />
<img src="https://img.shields.io/badge/umi-^3.5.23-blueviolet" alt="" />
<img src="https://img.shields.io/badge/antd-5.x-magenta" alt="" />
<img src="https://img.shields.io/badge/Bpmn.js-^9.0.3-magenta" alt="" />
</p>



----




## 简介

项目基于bpmnJs集成了bpmn流程设计器，自定义属性面板panel，对palette和canvas样式做了适应主题的处理；

顶部添加了一些常用功能，如下载流程图、模拟流转、放大缩小、恢复撤销等；

支持activiti、flowable、camunda3种模式的流程设计，可在配置中心中进行切换；

此外添加了一键换肤、明亮暗夜模式切换等辅助性功能。

在线demo请访问：http://designer.v2star.top/



### 参考与致谢

本项目很大程度参考了 [miyuesc](https://github.com/miyuesc/bpmn-process-designer) 的项目，在此对所参考项目提供的帮助表示衷心感谢。

1. 参考项目：https://github.com/miyuesc/bpmn-process-designer
2. 参考文章：https://juejin.cn/post/6844904017584193544



## 快速启动 

本项目基于[UmiJS](https://umijs.org/)构建。

```bash
$ yarn // 安装依赖
$ yarn start // 启动
```



## 其它说明



### bpmnJs版本

由于1.0后的和1.0之前的属性面板有较大的改变，且相关的api名称或位置可能也有改变，因此，在这里说明一下当前项目集成的版本。

```json
"bpmn-js": "^9.0.3",
"bpmn-js-properties-panel": "^1.0.0",
"camunda-bpmn-moddle": "^6.1.2",
```

