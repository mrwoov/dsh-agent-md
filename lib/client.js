window.__ModuleLoader__.load({
  id: "@mrwoov/dsh-agent-md",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    const React = require("react");

    const inject = ["slots"];

    function AgentView(props) {
      const useSessions = props.useSessions
      const sessionId = props.sessionId
      const cwd = useSessions((s) => s.byId[sessionId]?.cwd) || ""

      const co = React.useState(""); const content = co[0]; const setContent = co[1]
      const st = React.useState("loading"); const status = st[0]; const setStatus = st[1]
      const er = React.useState(null); const err = er[0]; const setErr = er[1]
      const di = React.useState(false); const dirty = di[0]; const setDirty = di[1]

      React.useEffect(function () {
        if (!cwd) { setStatus("error"); setErr("没有项目目录"); return }
        let cancelled = false
        setStatus("loading"); setErr(null)
        fetch("/api/agent-md?path=" + encodeURIComponent(cwd))
          .then(function (r) { return r.json() })
          .then(function (d) {
            if (cancelled) return
            if (d.error) { setStatus("error"); setErr(d.error); return }
            setContent(d.content || ""); setDirty(false); setStatus("ready")
          })
          .catch(function (e) { if (!cancelled) { setStatus("error"); setErr(String(e)) } })
        return function () { cancelled = true }
      }, [cwd])

      function save() {
        setStatus("saving"); setErr(null)
        fetch("/api/agent-md?path=" + encodeURIComponent(cwd), {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ content: content })
        })
          .then(function (r) { return r.json() })
          .then(function (d) {
            if (d.ok) { setDirty(false); setStatus("saved") } else { setStatus("error"); setErr(d.error || "保存失败") }
          })
          .catch(function (e) { setStatus("error"); setErr(String(e)) })
      }

      const statusText = status === "loading" ? "加载中…" : status === "saving" ? "保存中…" : status === "saved" ? "已保存" : status === "error" ? err : (dirty ? "未保存" : "已加载")
      const statusCls = status === "error" ? "agentmd__status agentmd__status--err" : "agentmd__status"

      return React.createElement("div", { className: "agentmd" },
        React.createElement("div", { className: "agentmd__bar" },
          React.createElement("span", { className: "agentmd__path", title: cwd + "/AGENTS.md" }, cwd + "/AGENTS.md"),
          React.createElement("span", { className: statusCls }, statusText),
          React.createElement("button", { className: "agentmd__save", onClick: save, disabled: status === "saving" || status === "loading" }, "保存")),
        React.createElement("textarea", { className: "agentmd__edit", value: content, onChange: function (e) { setContent(e.target.value); setDirty(true) }, spellCheck: false, placeholder: "AGENTS.md 不存在 — 输入内容后点保存即可创建" }))
    }

    function apply(ctx) {
      const css = ".agentmd{display:flex;flex-direction:column;height:100%;min-height:0;padding:8px 12px;gap:6px;box-sizing:border-box;}" +
        ".agentmd__bar{display:flex;align-items:center;gap:10px;font-size:12px;color:var(--dsw-alias-label-secondary);flex:none;}" +
        ".agentmd__path{font-family:ui-monospace,Consolas,monospace;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;}" +
        ".agentmd__status{font-size:11px;flex:none;}" +
        ".agentmd__status--err{color:var(--dsw-alias-state-error-primary);}" +
        ".agentmd__save{background:var(--dsw-alias-brand-primary);color:#fff;border:none;border-radius:6px;padding:3px 10px;font-size:12px;cursor:pointer;flex:none;}" +
        ".agentmd__save:disabled{opacity:.6;cursor:default;}" +
        ".agentmd__edit{flex:1;min-height:0;width:100%;resize:none;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;color:var(--dsw-alias-label-primary);font-family:ui-monospace,Consolas,monospace;font-size:12px;line-height:1.6;padding:8px;box-sizing:border-box;}"
      const style = document.createElement("style")
      style.textContent = css
      document.head.appendChild(style)
      ctx.effect(function () { return function () { style.remove() } }, "dsh-agent-md: css")

      ctx.slots.inject("conversation.view", function () {
        return ctx.slots.register({ name: "conversation.view", id: "agent", order: 20, label: "Agent" }, function (props) {
          return React.createElement(AgentView, props)
        })
      })
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  }
});


