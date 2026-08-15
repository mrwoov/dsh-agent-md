# dsh-agent-md

DSH Web GUI 插件:在会话「对话 / 轨迹」tab 栏新增 **Agent** tab,用于浏览和编辑当前项目的 `AGENTS.md`。

## 功能

- 会话头部 tab 栏新增「Agent」tab
- 显示当前项目根目录(会话 cwd)下的 `AGENTS.md`
- 直接编辑,点「保存」写入磁盘;文件不存在时保存即创建
- 切换会话自动加载对应项目的 AGENTS.md

## 安装

1. 把本包放到 `~/.dsh/profiles/web/node_modules/@mrwoov/` 下
2. 在 `~/.dsh/profiles/web/cordis.patch.yml` 追加:

```yaml
- insert:
    - id: agent-md
      name: '@mrwoov/dsh-agent-md'
```

3. 重启 dsh 进程

## HTTP 接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/agent-md?path=<项目目录>` | 返回 `{ exists, content }` |
| POST | `/api/agent-md?path=<项目目录>` body `{ content }` | 写入 `<目录>/AGENTS.md` |

## 技术要点

- host 半(`lib/index.js`):注册 `/api/agent-md` 路由,读写 `<path>/AGENTS.md`
- client 半(`lib/client.js`):注册进 `conversation.view` 槽(`id: agent`,tab 文字「Agent」)
- 纯 JavaScript,无构建步骤
- License: Apache-2.0
