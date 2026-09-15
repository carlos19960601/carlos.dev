---
title: "Typst 简明语法教程"
date: "Sep 2026"
publishedAt: "2026-09-15"
readTime: "8 min read"
summary: "一份按模式组织的 Typst 语法速查：标记、代码、内容块、set/show 与数学模式，只讲写文档时真正会用到的规则。"
tags: ["Typst", "Syntax"]
featured: true
---

## 语法

### Markup

| 记号 | 名称 | 示例 | 说明 |
| --- | --- | --- | --- |
| `=` | Heading | `= 一级标题`、`== 二级标题` | 写在行首，等号数量决定层级，最多六级 |
| `_` | Emphasis | `_斜体_` | 成对包裹一段文本，渲染为斜体 |
| `*` | Strong emphasis | `*粗体*` | 成对包裹一段文本，渲染为粗体 |
| `-` | 无序列表 | `- 项目` | 行首写 `-`，缩进后成为子项 |
| `+` | 有序列表 | `+ 项目` | 行首写 `+`，编号自动生成 |
| `\` | Line break | `第一行 \ 第二行` | 强制换行 |


## Styling

## Layout

### page([🔗](https://typst.app/docs/reference/layout/page/))


`page` 把内容应用到1页或多页上。主要用于 `#set page(...)` 改页面属性；

`#set page(...)`

| 参数 | 示例 | 说明 |
| --- | --- | --- |
| `paper` | `paper: "a4"` | 标准纸张，默认 `"a4"` |
| `width` | `width: 16cm` | 自定义页宽 |
| `height` | `height: 24cm` | 自定义页高 |
| `flipped` | `flipped: true` | 宽高对调，横向 |
| `margin` | `margin: (x: 2cm, y: 2.5cm)` | 页边距；也可写 `top` / `bottom` / `left` / `right` |
| `numbering` | `numbering: "1"` | 页码格式 |
| `number-align` | `number-align: center` | 页码对齐 |
| `header` | `header: [标题]` | 页眉 |
| `footer` | `footer: []` | 页脚 |
| `columns` | `columns: 2` | 栏数 |
| `fill` | `fill: white` | 页面背景色 |

#### 常见用法

设置页眉：

```typst
#set page(header: [
  #image("health/OLUSIUTAMA Logo Name.jpg", width: 50%)
])
```

设置背景：

```typst
#set page(
  background: align(top + right, image("health/OLUSIUTAMA Logo.png", width: 40%)),
)
```

设置页脚：

```typst
#set page(
  footer: [
     #image("footer-info.png"),
   ],
)
```

注意：`footer` 的宽度永远是内容区宽度（页面宽度减左右 margin），你改不了它让它跨出到 margin 外。


### pagebreak([🔗](https://typst.app/docs/reference/layout/pagebreak/))

在当前位置强制换到下一页。

```typst
#pagebreak()
```

### place([🔗](https://typst.app/docs/reference/layout/place/))

相对父容器放置内容，默认叠在已有内容上面。

```typst
#place(bottom + left, dx: 6%, dy: -2%, image("footer-info.png", width: 25%))
```

### align([🔗](https://typst.app/docs/reference/layout/align/))

水平、垂直对齐内容。

```typst
#align(center)[内容]
#set align(center)
```

### columns([🔗](https://typst.app/docs/reference/layout/columns/))

把区域拆成多列等宽栏。

```typst
#columns(2, gutter: 8pt)[
  第一栏
  #colbreak()
  第二栏
]
```

### grid([🔗](https://typst.app/docs/reference/layout/grid/))

把内容排成网格。

```typst
#grid(
  columns: (1fr, 2fr),
  gutter: 8pt,
  [左], [右],
)
```

| 参数 | 示例 | 说明 |
| --- | --- | --- |
| `columns` | `columns: (1fr, 2fr)` | 列宽；写成整数如 `3` 表示三列 `auto` |
| `rows` | `rows: (auto, 60pt)` | 行高；单元格超出时重复最后一行 |
| `gutter` | `gutter: 8pt` | 同时设置行列间距 |
| `column-gutter` | `column-gutter: 8pt` | 列间距 |
| `row-gutter` | `row-gutter: 8pt` | 行间距 |
| `inset` | `inset: 8pt` | 单元格内边距 |
| `align` | `align: center` | 单元格对齐 |
| `fill` | `fill: luma(95%)` | 单元格背景 |
| `stroke` | `stroke: 0.5pt` | 网格线 |
