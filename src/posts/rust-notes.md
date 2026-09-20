---
title: "Rust 学习笔记"
date: "Sep 2026"
publishedAt: "2026-09-17"
readTime: "2 min read"
summary: "一份持续补充的 Rust / Cargo 速查笔记：目前涵盖 Cargo 环境变量（CARGO_MANIFEST_DIR 等），按官方文档分类组织，用到哪个补哪个。"
tags: ["Rust", "Cargo"]
featured: false
---

## Cargo

### Environment Variables([🔗](https://doc.rust-lang.org/cargo/reference/environment-variables.html#environment-variables))

Cargo 会设置和读取一系列环境变量：一部分可以覆盖，用来改变 Cargo 在本机的行为；另一部分由 Cargo 在构建过程中注入，供代码和构建脚本读取。官方文档按交互时机分为四类，本笔记按需逐个补充。

#### Cargo 读取的变量

覆盖后可改变 Cargo 的行为，如 `CARGO_HOME`、`CARGO_TARGET_DIR`、`RUSTFLAGS`、`CARGO_INCREMENTAL` 等。

<!-- TODO：待补充 -->

#### Cargo 为 crate 设置的变量

编译期注入，源码中用 `env!("VAR")` 读取；`cargo run` / `cargo test` 运行二进制时同样可见。注意：manifest 中未填写的字段，对应变量为空字符串。

| 变量 | 作用 | 笔记 |
| --- | --- | --- |
| `CARGO_MANIFEST_DIR` | 包的 manifest 所在目录 | ✅ 已整理 |
| `CARGO_MANIFEST_PATH` | 包的 manifest 文件完整路径 | 待补充 |
| `CARGO_PKG_VERSION` 及 `_MAJOR` / `_MINOR` / `_PATCH` / `_PRE` | 包版本信息 | 待补充 |
| `CARGO_PKG_NAME` / `AUTHORS` / `DESCRIPTION` / `HOMEPAGE` / `REPOSITORY` / `LICENSE` / `LICENSE_FILE` / `README` / `RUST_VERSION` | 包元信息 | 待补充 |
| `CARGO_CRATE_NAME` / `CARGO_BIN_NAME` | 当前编译的 crate / 二进制目标名 | 待补充 |
| `OUT_DIR` | build script 的输出目录（仅编译期存在） | 待补充 |
| `CARGO_BIN_EXE_<name>` | 二进制目标可执行文件的绝对路径（集成测试 / bench） | 待补充 |
| `CARGO_PRIMARY_PACKAGE` | 是否为命令行选中的主包（仅编译期存在） | 待补充 |
| `CARGO_TARGET_TMPDIR` | 集成测试 / bench 专用临时目录 | 待补充 |

##### CARGO_MANIFEST_DIR

包的 `Cargo.toml` 所在目录的**绝对路径**。

```rust
// env! 在编译期把值内联为字符串字面量，运行时零开销
let manifest_dir = env!("CARGO_MANIFEST_DIR");
```

典型用途 —— 定位包内资源（测试 fixture、模板、SQL 等）：

```rust
use std::path::Path;

let fixture = Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/fixtures/input.txt");
```

要点：

- `env!` 是编译期宏，变量不存在会直接编译失败；值可能缺失的场景改用 `option_env!`。
- 对 build script 而言，它同时是脚本启动时的**初始工作目录**（即 `std::env::current_dir()` 的返回值）。
- 值来自**编译机器**，二进制分发到用户机器后不可依赖它定位运行期资源。
- 与 `CARGO_MANIFEST_PATH` 的区别：前者是目录，后者是 `Cargo.toml` 文件的完整路径。

#### Cargo 为 build script 设置的变量

`build.rs` **运行时**读取。注意：编译 build.rs 本身时这些变量尚不存在，`env!` 不可用，须用 `std::env::var` 获取。包括 `TARGET`、`HOST`、`OUT_DIR`、`CARGO_FEATURE_<name>`、`CARGO_CFG_*`、`OPT_LEVEL`、`PROFILE`、`CARGO_MAKEFLAGS` 等。

<!-- TODO：待补充 -->

#### 其他：cargo test 与第三方子命令

- `cargo test` 运行期注入：`CARGO_BIN_EXE_<name>` 等。
- 第三方子命令（`cargo-foobar`）可见：`CARGO`、`CARGO_MAKEFLAGS` 等。

<!-- TODO：待补充 -->
