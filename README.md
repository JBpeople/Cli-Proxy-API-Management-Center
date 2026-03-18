# CLIProxyAPI 管理面板（JBpeople fork）

这是 JBpeople 版 CLIProxyAPI 的配套前端面板 fork。

这个前端 fork 主要围绕 **OpenAI-compatible 提供商管理** 做增强，让模型自动发现这套流程更顺手。

## 这个 fork 做了什么

- 新增独立的 **模型同步** 页面
- 支持 **立即同步** 按钮
- 在 OpenAI-compatible 提供商编辑页新增 **自动发现模型** 开关
- 新增功能相关 UI 统一改成更适合中文使用的表达

## 这个前端配套的后端仓库

- https://github.com/JBpeople/CLIProxyAPI

对应的后端 fork 提供：

- 从 `/v1/models` 自动发现模型
- 模型同步状态接口
- 让自动发现的模型参与 auth 注册与调用链路

## 本前端依赖的新增后端接口

```text
GET  /v0/management/model-sync/status
POST /v0/management/model-sync/run
```

## 构建

```bash
npm install
npm run build
```

构建产物：

- `dist/index.html`

部署时可以把它复制/改名为：

- `management.html`

然后放进 CLIProxyAPI 的静态目录里。

## 说明

这个前端 fork 最好和配套后端 fork 一起使用。
如果直接搭配 upstream 原版后端，新增 UI 可能能显示，但功能不一定完整可用。

## 许可证

MIT
