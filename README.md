<p align="center">
  <a href="https://github.com/mrwoov/dsh-agent-md"><img src="https://img.shields.io/github/stars/mrwoov/dsh-agent-md?style=flat&amp;label=%E2%98%85&amp;color=08C" alt="GitHub stars"></a>
  <img src="https://img.shields.io/badge/DSH-Web%20Plugin-47848F?style=flat" alt="DSH web plugin">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-2EA44F?style=flat" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/基于-DeepSeek%20Harness-4D6BFE?style=flat" alt="Based on DeepSeek Harness">
</p>

<p align="center"><sub>中文</sub></p>

<h3 align="center">在 DSH Web 会话中直接浏览和编辑 AGENTS.md(<a href="#主要功能">插件</a>)</h3>

## 这是什么

DSH(DeepSeek Harness)Web GUI 插件:在会话「对话 / 轨迹」tab 栏新增 **Agent** tab,用于浏览和编辑当前项目的 `AGENTS.md`,让项目级 agent 指令随时可见、可改。

## 主要功能

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>会话内 Tab</h3>
      <p>在会话头部 tab 栏新增「Agent」tab,与「对话」「轨迹」并列,随时切换,无需离开当前会话。</p>
    </td>
    <td width="50%" valign="top">
      <h3>项目 AGENTS.md</h3>
      <p>自动定位当前会话项目目录下的 <code>AGENTS.md</code>;文件不存在时,输入内容保存即自动创建。</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>浏览 + 编辑</h3>
      <p>等宽字体直接编辑,顶部显示「未保存 / 已保存」状态,一键写回磁盘。</p>
    </td>
    <td width="50%" valign="top">
      <h3>随会话切换</h3>
      <p>切换会话自动加载对应项目的 AGENTS.md,不会串文件、串目录。</p>
    </td>
  </tr>
</table>

## 安装

1. 把本包放到 `~/.dsh/profiles/web/node_modules/@mrwoov/` 下
2. 在 `~/.dsh/profiles/web/cordis.patch.yml` 追加:

```yaml
- insert:
    - id: agent-md
      name: '@mrwoov/dsh-agent-md'
```

3. 重启 dsh 进程

> 提示:修改包名 / 删除插件 / 改动组合配置后,必须重启 dsh 才彻底生效(热更新只增不删,见技术要点)。

## HTTP 接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/agent-md?path=<项目目录>` | 返回 `{ exists, content }` |
| POST | `/api/agent-md?path=<项目目录>` body `{ content }` | 写入 `<目录>/AGENTS.md` |

## 技术要点

- host 半(`lib/index.js`):注册 `/api/agent-md` 路由,读写 `<path>/AGENTS.md`
- client 半(`lib/client.js`):注册进 `conversation.view` 槽(`id: agent`,tab 文字「Agent」)
- 纯 JavaScript,无构建步骤,复制即用
- dsh 的 patch 热更新语义是「只增改、不删除」:改名 = 新增 + 旧残留,必须重启清场,否则旧 bundle URL 404 会拖垮整页

## 与 DeepSeek Harness 的关系

本项目是基于 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 的 Cordis 插件机制开发的 Web UI 插件。

核心的智能体、会话、插件系统和 Web UI 都来自官方 Harness;本插件只负责:

- 在会话视图环(`conversation.view`)中提供一个「Agent」视图
- 通过 host 路由读写项目根目录的 AGENTS.md

如果你需要命令行运行 Harness,或参与核心功能开发,请优先查看[官方仓库](https://github.com/deepseek-ai/deepseek-harness)。

## 特别感谢

感谢 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 项目和 DeepSeek AI 团队,以及 [Cordis](https://github.com/cordiverse/cordis) 提供的插件化基础。

同时感谢 [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) 项目与作者 zhu1090093659,本插件的目录结构、`dsh.client` 声明与 patch 挂载方式沿用了 dsh-web-ui 插件家族的最佳实践。

And you.

## 友情链接

这里收录 DeepSeek Harness 生态项目。

| 项目 | 简介 | 链接 |
| --- | --- | --- |
| DeepSeek Harness | 官方项目:核心智能体、插件系统与 Web UI。 | [GitHub](https://github.com/deepseek-ai/deepseek-harness) |
| dsh-web-ui | DSH Web UI 插件与皮肤合集(本插件的挂载方式参考来源)。 | [GitHub](https://github.com/zhu1090093659/dsh-web-ui) |
| Awesome DSH Plugin | DeepSeek Harness 社区插件精选列表。 | [GitHub](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) |

## 开发

纯 JavaScript,无构建步骤。修改 `lib/` 后,把包同步到 `~/.dsh/profiles/web/node_modules/@mrwoov/dsh-agent-md/` 并重启 dsh 即可。

```sh
# 本地快速语法检查
node --check lib/index.js
node --check lib/client.js
```

## License

本项目遵循 [MIT License](LICENSE)。

> 本项目是 DeepSeek Harness 生态的社区插件,并非 DeepSeek 官方产品。

> 本项目完全开源免费。如果有人向您以任何形式出售此软件,请拒绝交易。
