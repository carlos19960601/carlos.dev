---
title: "Rust 声明宏（macro_rules!）使用指南"
date: "Sep 2026"
publishedAt: "2026-09-20"
readTime: "10 min read"
summary: "系统整理 Rust 声明宏的写法：片段说明符、重复与递归、宏展开规则与常见坑，配合实际用例讲解 macro_rules! 的设计思路。"
tags: ["Rust", "Macro"]
featured: false
---

## 参考

- [Macros By Example — The Rust Reference](https://doc.rust-lang.org/stable/reference/macros-by-example.html)：官方参考手册中关于声明宏（macro_rules!）的章节。

## 核心构成

一条 `macro_rules!` 规则由**匹配模式**和**转写**两部分组成，`=>` 左边负责捕获输入，右边负责吐出代码：

```rust
macro_rules! my_macro {
    (匹配模式) => { 展开代码 };  // 一条规则，可以有多条并用分号隔开
}
```

| 构成 | 术语 | 说明 |
| --- | --- | --- |
| `$name` | **metavariable**（元变量） | 模式里捕获到的值，在转写中占位使用 |
| `$( ... )+` 整段语法 | **repetition**（重复） | 匹配/生成任意次数的一坨代码 |
| `*` / `+` / `?` | **repetition operator** | 控制重复次数：0+ / 1+ / 至多 1 次 |
| `=>` 右边怎么吐代码 | **transcription**（转写） | 展开结果的模板 |
| `$name:ident = $value:expr` | 被重复的 **fragment** | 模式中最小的捕获单元 |

### 元变量与 fragment

元变量的写法是 `$名字: 片段说明符`，即 `$name:ident`、`$value:expr`。冒号后面是 **fragment specifier**（片段说明符），告诉编译器该位置接受什么样的语法：

| 说明符 | 匹配内容 | 示例 |
| --- | --- | --- |
| `ident` | 标识符 | `width`、`foo` |
| `expr` | 表达式 | `1 + 2`、`f(x)` |
| `ty` | 类型 | `u32`、`Vec<String>` |
| `pat` | 模式 | `Some(x)`、`_` |
| `literal` | 字面量 | `42`、`"hi"` |
| `stmt` | 语句 | `let x = 1` |
| `block` | 块表达式 | `{ ... }` |
| `path` | 路径 | `std::mem::drop` |
| `tt` | 单个 token tree | 任意一个 token 或括号组，最宽泛 |

要点：

- 捕获是**按语法结构**的，不是按文本：`$v:expr` 捕到的是完整表达式（内部带括号/优先级信息），转写时不会被拆散。
- 宏展开发生在**语法解析之后、类型检查之前**，所以宏只看 token，不知道类型。
- 拿不准用什么说明符时，`tt`（token tree）是兜底选项，配合递归可以解析任意结构。

### repetition（重复）

`$( ... )` 把一段模式包起来表示「这段可以出现多次」，完整语法是：

```text
$( 模式 ) 分隔符? 重复运算符
```

- **模式**：内部还是普通的元变量 / token，比如 `$name:ident = $value:expr`。
- **分隔符**（可选）：输入中各项之间的 token，常见 `,`、`;`。
- **重复运算符**：`*`（0 次及以上）、`+`（至少 1 次）、`?`（至多 1 次，**不能带分隔符**）。

### 转写（transcription）

`=>` 右边是展开模板：`$name` 会被替换为捕获的内容，`$( ... )op` 会对捕获序列逐个展开，**重复的嵌套结构必须与模式一一对应**（模式里嵌了两层，转写里也得嵌两层，不能拍平）。

`$(,)?` 是惯用小技巧：允许调用方写尾逗号，分隔符位置就写成普通 token `,` 而不是元变量。

## 完整示例

把五个概念拼在一起 —— 一个 `名字 = 值` 列表的宏：

```rust
macro_rules! config {
    // 匹配模式：0 个或多个 `ident = expr`，逗号分隔，尾逗号可有可无
    ( $( $name:ident = $value:expr ),* $(,)? ) => {
        // 转写：对每个捕获各生成一条 let 语句
        $(
            let $name = $value;
        )*
    };
}

fn main() {
    config! {
        width = 800,
        height = 600,
    }
    println!("{}x{}", width, height); // 800x600

    config! {
        a = 1 + 2 // 没有尾逗号也能匹配
    }
    println!("a = {a}"); // a = 3
}
```

逐块拆解：

- `$( ... ),*` —— **repetition** + 运算符 `*`，允许列表为空或任意长。
- `$name:ident = $value:expr` —— 被重复的 **fragment**：一个 `ident` 元变量、字面 token `=`、一个 `expr` 元变量。
- `$(,)?` —— 重复运算符 `?` 单独成组，匹配可选的尾逗号。
- `let $name = $value;` —— **转写**：每个捕获生成一条语句，因为宏调用位于语句位置，展开出的多条 `let` 直接就地生效，调用方能直接使用 `width`、`height`。

## 参考

- [Macros By Example — The Rust Reference](https://doc.rust-lang.org/stable/reference/macros-by-example.html)：官方参考手册中关于声明宏（macro_rules!）的章节。
