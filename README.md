# LS-Paintboard-AutoPaint

## 简介

冬日绘板自动绘画脚本，在 [IceCang/SegonPaintboard-AutoPaint](https://github.com/IceCang/SegonPaintboard-AutoPaint) 的基础上做了一些更改。

## 功能

1. 自动分析形势
2. 只输出错误信息和统计信息
3. 发现错误 token 后立刻弃用
4. 锁定 token
5. 多线程维护
6. 优先级模式
7. 即使发生错误也不会停止运行

## 设置

1. `url`：绘版的 URL
2. `fetchTime`：获取间隔，默认为 10.1 秒，不建议更改
3. `paintTime`：获取间隔，默认为 30.1 秒，不建议更改
4. `startTimestamp`：活动开始时间（Unix 时间戳），默认为 `2023-04-01 00:00:00`
5. `endTimestamp`：活动结束时间（Unix 时间戳），默认为 `2023-04-01 23:59:59`
6. `mode`：模式选择，可选 `random`、`priority`、`auto`，默认为 `auto`
    - `random`：随机绘制模式：随机绘制
    - `priority`：优先级模式：如果该像素绘制失败则该像素的绘制优先级加一
    - `auto`：推平且自动分析形势
7. `images`：存储图片（`json` 文件）路径
    - 建议路径为 `pic-json/pic<x>.json`，x 为图片编号
    - `id`：Json 文件名（不带后缀）
    - `x`：图片的 x 坐标
    - `y`：图片的 y 坐标
8. `tokens`：用来存储 token
    - `uid`：用户 ID
    - `token`：Token

## 使用

1. 下载 [Node.js](https://nodejs.org/zh-cn/) 和 [Python](https://www.python.org/downloads/)
2. 在 `pic` 文件夹中放入待转换的图片
3. 将 `config-example.json` 重命名为 `config.json` 并进行相关配置
4. 在脚本根目录运行 `init.ps1`
5. 在脚本根目录下执行 `npm start`

推荐使用 Windows Terminal 运行脚本。