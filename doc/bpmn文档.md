# 文档

声明：文档内容转载于以下链接，不得用于商业用途，仅用于学习交流，如需用于商业，请联系作者。

> 文档主要内容转载于以下链接：
>
> 1. miyue开源项目地址：https://github.com/miyuesc/bpmn-process-designer
> 2. 掘金文档地址：https://juejin.cn/post/6900793894263488519#heading-14

# Bpmn.js 中文文档（一）

## 一. 引入Bpmn.js并初始化建模器

```javascript
/* 基于vue2.x， 省略了template模板与部分data */

import BpmnModeler from "bpmn-js/lib/Modeler"

export default {
    methods: {
        initModeler() {
            this.bpmnModeler = new BpmnModeler({
                container: document.getElementById("bpmn-container")
            })
        }
    },
    mounted() {
        this.initModeler();
    }
}
```

进入到源文件Modeler.js，可以找到创建Modeler建模器的时候需的参数。

```javascript
this.bpmnModeler = new BpmnModeler(options: Options）;

interface Options {
	container: DomElement; // 渲染容器
	width：string | number；// 查看器宽度
	height: string | number； // 查看器高度
	moddleExtensions： object；// 需要用的扩展包
	modules：<didi.Module>[]; // 自定义且需要覆盖默认扩展包的模块列表
	additionalModules: <didi.Module>[]; // 自定义且与默认扩展包一起使用的模块列表
}
```

初始化完成之后，在控制台打印`this.bpmnModeler`，可以发现`BpmnModeler`类继承了多个基础类。

```rust
Modeler
	-> BaseModeler
		-> BaseViewer
			-> Diagram
				-> Object
```

Bpmn.js提供的默认扩展包名称，可以在`this.bpmnModeler.**proto**._modules`内找到，一共开放了32个扩展包。扩展包名称可以在`this.bpmnModeler.injector._providers`内，包名即键名。

需要调用这些扩展包时，可以使用如下方式：

```javascript
const xxxModule = this.bpmnModeler.get("xxx"); // xxx代表扩展包名称
```

Modeler实例化之后可直接调用的方法：

```javascript
/**
 * 返回name对应的模块实例
 * @param { string } name 模块名
 * @param { boolean } strict 启用严格模式。false：缺少的模块解析为null返回；true：抛出异常
 */
this.bpmnModeler.get(name, strict);

// 创建空白流程图
// 内部调用了importXML方法，读取内部的默认xml字符串
this.bpmnModeler.createDiagram();

// 将图形dom挂载到目标节点
this.bpmnModeler.attachTo(parentNode);

// 清空
this.bpmnModeler.clear()

// 销毁
this.bpmnModeler.destroy()

// 脱离dom
this.bpmnModeler.detach()

// 获取流程定义
this.bpmnModeler.getDefinitions()

// 获取扩展功能模块列表
this.bpmnModeler.getModules()

/**
 * 导入解析的定义并呈现BPMN 2.0图。完成后，查看器将结果报告回给提供的回调函数（错误，警告）
 * @param { ModdleElement<Definitions> } definitions 模块名
 * @param { ModdleElement<BPMNDiagram>|string } [bpmnDiagram] 要呈现的BPMN图或图的ID（如果未提供，将呈现第一个）
 */
this.bpmnModeler.importDefinitions(definitions, bpmnDiagram)

/**
 * 导入xml（字符串形式），返回导入结果
 * 后续会取消传入回调函数的方式
 * 推荐使用async/await或者链式调用
 * @param { string } xml 流程图xml字符串
 * @param { Promise } callback 回调函数，出错时返回{ warnings，err }
 */
this.bpmnModeler.importXML(xml, callback)

// 注销事件监听器
this.bpmnModeler.off(eventName, callback)

// 注册事件监听，同名将删除以前的监听器，privorty可不传，程序会自动替换回调函数
this.bpmnModeler.on(eventName, priority, callback, target)

// em。。。不了解
this.bpmnModeler.open()

// 保存为svg文件，与importXML方法一样，后续会取消传入callback的方式
this.bpmnModeler.saveSVG(callback)

// 保存为xml文件，与importXML方法一样，后续会取消传入callback的方式
this.bpmnModeler.saveXML(callback)
```

## 二. 基础功能





