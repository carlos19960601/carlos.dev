---
title: "Markdown 媒体嵌入：图片与 Excalidraw"
date: "Dec 2025"
publishedAt: "2025-12-12"
readTime: "2 min read"
summary: "演示文章中嵌入图片与 Excalidraw 手绘图表的写法，可作为后续写作的速查模板。"
tags: ["Markdown", "Excalidraw"]
featured: false
---

## 嵌入图片

把图片放进 `static/images/<文章名>/` 目录，然后用标准的 Markdown 图片语法引用：

```markdown
![一张示例插画](/images/markdown-media-demo/illustration.png "这是图片标题，会显示为图注")
```

效果如下：

![一张示例插画](/images/markdown-media-demo/illustration.png "插图标题会自动显示为图注")

---

## 嵌入 Excalidraw 图表

在 [excalidraw.com](https://excalidraw.com) 绘制图表后，导出为 **嵌入场景数据（Embed scene）的 SVG** 放进 `static/excalidraw/` 目录，原稿可保存在 `excalidraw/` 目录存档备忘。在文章中直接使用图片语法引用即可：

```markdown
![渲染管线示意图](/excalidraw/pipeline.svg)
```

效果如下：

![渲染管线示意图](/excalidraw/pipeline.svg)

图表服务端预打包内联直出，零引擎开销；同时支持 **Ctrl+滚轮缩放、拖拽平移、双指捏合、双击复位与全屏查看**，并自适应明亮/暗黑模式。将来若需修改，直接将 SVG 拖回 Excalidraw 即可继续编辑。
