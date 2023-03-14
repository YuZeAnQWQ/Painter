# LS-Paintboard-AutoPaint

[![](https://img.shields.io/github/commit-activity/m/hjl2011/LS-Paintboard-AutoPaint?logo=GitHub&style=flat-square)](https://github.com/hjl2011/LS-Paintboard-AutoPaint)
[![](https://img.shields.io/github/stars/hjl2011/LS-Paintboard-AutoPaint?logo=GitHub&style=flat-square)](https://github.com/hjl2011/LS-Paintboard-AutoPaint)
[![](https://img.shields.io/github/languages/code-size/hjl2011/LS-Paintboard-AutoPaint?logo=GitHub&style=flat-square)](https://github.com/hjl2011/LS-Paintboard-AutoPaint)
[![](https://img.shields.io/github/downloads/hjl2011/LS-Paintboard-AutoPaint/latest/total?style=flat-square)](https://github.com/hjl2011/LS-Paintboard-AutoPaint)
[![](https://img.shields.io/github/last-commit/hjl2011/LS-Paintboard-AutoPaint?style=flat-square)](https://github.com/hjl2011/LS-Paintboard-AutoPaint)


## 简介

冬日绘板自动绘画脚本，在 [IceCang/SegonPaintboard-AutoPaint](https://github.com/IceCang/SegonPaintboard-AutoPaint) 的基础上做了一些更改。您使用本脚本即代表您同意[特殊声明](#特殊声明)。

## 功能

1. 多种模式
2. 只输出错误信息和统计信息
3. 发现错误 token 后立刻弃用
4. 锁定 token
5. 多线程维护
6. 即使发生错误也不会停止运行
7. 自定义绘版 url

## 设置

- `config.json`
    1. `url`：绘版的 URL
    2. `fetchTime`：获取间隔，默认为 10.1 秒，不建议更改
    3. `paintTime`：获取间隔，默认为 30.1 秒，不建议更改
    4. `startTimestamp`：活动开始时间（Unix 时间戳），默认为 `2023-04-01 00:00:00`
    5. `endTimestamp`：活动结束时间（Unix 时间戳），默认为 `2023-04-01 23:59:59`
    6. `mode`：模式选择，可选 `random`、`priority`、`auto`、`direction1`、`direction2`、`direction3`、`direction4`，默认为 `auto`
        - `random`（随机模式）：随机绘制
        - `priority`（优先级模式）如果该像素绘制失败则该像素的绘制优先级加一
        - `auto`（自动模式）：按 `config.pictures` 的顺序推平且自动分析形势
        - `direction1`（方向模式，从上到下）：从上到下绘制
        - `direction2`（方向模式，从下到上）：从下到上绘制
        - `direction3`（方向模式，从左到右）：从左到右绘制
        - `direction4`（方向模式，从右到左）：从右到左绘制
    7. `images`：存储图片（`json` 文件）路径
        - 建议路径为 `pic-json/pic<x>.json`，x 为图片编号
        - `id`：Json 文件名（不带后缀）
        - `x`：图片的 x 坐标
        - `y`：图片的 y 坐标
- `tokens.json`
    - 用来存储 token
    - `uid` 为用户 ID
    - `token` 为用户 Token

## 使用

1. 下载 [Node.js](https://nodejs.org/zh-cn/) 和 [Python](https://www.python.org/downloads/)
2. 在 `pic` 文件夹中放入待转换的图片
3. 将 `config-example.json` 重命名为 `config.json` 并进行相关配置
4. 将 `tokens-example.json` 重命名为 `tokens.json` 并进行相关配置
5. 在脚本根目录运行 `init.ps1`
6. 在脚本根目录下执行 `npm start`

推荐使用 Windows Terminal 运行脚本。

## 特殊声明

1. 从 2023 年 3 月 20 日起，开发者有权拒绝与其有竞争关系的用户使用该脚本（任何版本）。
2. 请勿滥用本脚本，开发者不对造成的任何后果负责。
3. 请勿在本脚本的基础上发布任何与本脚本名称大致相同的项目。