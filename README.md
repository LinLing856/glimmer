# 微光集 Glimmer · 人生大事记

一个单文件、零依赖、**纯本地存储**的人生大事记网页应用。打开即用，无需注册、无需登录、无需任何凭证。

> A single-file, zero-dependency life-timeline web app. Pure local storage — just open and use. No account, no cloud, no credentials.

**在线使用 / Live demo**: https://linling856.github.io/glimmer/

## ✨ 功能 / Features

- 📅 竖向 / 横向时间线切换，日期精度可选「年 / 月 / 日」
- 🎨 7 套主题（清新 / 可爱 / 暗黑……）
- 🎭 多角色、多时间线管理
- ▶️ 播放模式：时间线逐条生长动效 + 结尾诗句
- 🌐 中英双语界面切换（右上角 🌐 按钮）
- 💾 数据导出 / 导入 JSON 备份
- 📱 响应式设计，手机浏览器也可使用，支持添加到主屏幕（PWA manifest）

## 🔒 数据说明 / Data & Privacy

- 所有数据仅保存在**你自己的浏览器本地**（IndexedDB + localStorage 双保险），不上传任何服务器
- 换设备迁移：使用「更多 ⋮ → 备份」导出 JSON，在新设备导入即可
- 清除浏览器数据会丢失记录，请定期导出备份

## 🚀 使用 / Usage

无需构建。直接打开 `index.html`，或访问上方在线地址。

## 📁 文件 / Files

| 文件 | 说明 |
|---|---|
| `index.html` | 全部界面与逻辑（单文件应用） |
| `local-sync.js` | 本地存储层（空转接口，保持与云同步版接口一致） |
| `app-lang.js` | 中英双语切换层 |
| `manifest.webmanifest` / `icons/` | PWA 图标与清单 |

## 🔗 相关版本 / Other Editions

- **云同步版**（GitHub Gist 存储，需自己的 Token）：[glimmer-cloud](https://github.com/LinLing856/glimmer-cloud)
- 想要云端同步但保持代码私有？fork 本仓库后参考云同步版的实现自行部署。

---

*记录人生的高光与微光。Capture the glimmers of your life.*
