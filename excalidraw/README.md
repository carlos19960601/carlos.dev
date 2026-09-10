# Excalidraw 源文件目录

这里存放博客文章中用到的 Excalidraw 原稿工程文件（`.excalidraw`）。

## 工作流
1. 打开 [excalidraw.com](https://excalidraw.com) 绘制图表；
2. 保存工程文件到本目录（例如 `excalidraw/<name>.excalidraw`）备份；
3. 在 Excalidraw 中点击 **导出图片**：
   - 格式选择 **SVG**；
   - 勾选 **嵌入场景数据（Embed scene）**（方便未来拖回网站二次编辑）；
   - 导出后将 SVG 放置在 `static/excalidraw/` 目录下（如 `pipeline.light.svg` 与 `pipeline.dark.svg`，或直接 `pipeline.svg`）；
4. 在 Markdown 文章中直接以图片语法引用：
   ```markdown
   ![渲染管线示意图](/excalidraw/pipeline.svg)
   ```
