# LS-Paintboard-AutoPaint

## 简介

冬日绘板自动绘画脚本，在 [IceCang/SegonPaintboard-AutoPaint](https://github.com/IceCang/SegonPaintboard-AutoPaint) 的基础上做了一些更改。

## 功能

1. 自动分析形势（仅对于 `config.random = false` 时有效）
2. 只输出错误信息和统计信息（默认在 `stdout`）
3. 发现错误 token 后立刻弃用
4. 锁定 token
5. 多线程维护
6. 打架模式
7. 优先级模式（建议用来辅助打架模式）

## 设置

1. `fetchTime`：获取间隔，默认为 10.1 秒
2. `paintTime`：获取间隔，默认为 30.1 秒
3. `startTimestamp`：活动开始时间（UNIX 时间戳），默认为 `2023-04-01 00:00:00`
4. `endTimestamp`：活动结束时间（UNIX 时间戳），默认为 `2023-04-01 23:59:59`
5. `random`：打架模式，默认为 `false`
6. `priority_mode`：优先级模式，默认为 `true`
7. `images`：存储图片（`json` 文件）路径
    - 建议路径为 `pic-json/pic<x>.json`，x 为图片编号
    - `id`：Json 文件名（不带后缀）
    - `x`：图片的 x 坐标
    - `y`：图片的 y 坐标
8. `tokens`：存储 token

## 使用

1. 下载 Node.js 和 Python
2. 在 `pic` 文件夹中放入待转换的图片
3. 将 `config-example.json` 重命名为 `config.json` 并进行相关配置
4. 在脚本根目录运行 `init.ps1`
5. 在脚本根目录下执行 `npm start`

推荐用 Windows Terminal 运行。