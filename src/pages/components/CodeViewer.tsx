import { useEffect, useRef, useState } from "react";

import checkIcon from "../../assets/icons/check.svg?raw";
import copyIcon from "../../assets/icons/copy.svg?raw";
import { Icon } from "../../assets/icons/Icon";
import { Button } from "../../components/button";
import "./CodeViewer.css";

let highlighterPromise: Promise<(code: string) => string> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = Promise.all([
      import("shiki/core"),
      import("shiki/engine/javascript"),
      import("@shikijs/langs/tsx"),
      import("@shikijs/themes/github-light"),
    ]).then(async ([core, engine, language, theme]) => {
      const highlighter = await core.createHighlighterCore({
        langs: [language.default],
        themes: [theme.default],
        engine: engine.createJavaScriptRegexEngine(),
      });
      return (code: string) => highlighter.codeToHtml(code, { lang: "tsx", theme: "github-light" });
    }).catch((error) => {
      highlighterPromise = null;
      throw error;
    });
  }
  return highlighterPromise;
}

export function CodeViewer({ code, label }: { code: string; label: string }) {
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    setHighlighted(null);
    getHighlighter()
      .then((highlight) => { if (active) setHighlighted(highlight(code)); })
      .catch(() => { if (active) setHighlighted(null); });
    return () => { active = false; };
  }, [code]);

  useEffect(() => {
    setCopyStatus("idle");
    return () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    };
  }, [code]);

  async function copyCode() {
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
    resetTimer.current = window.setTimeout(() => setCopyStatus("idle"), 2000);
  }

  return (
    <div className="neo-code-viewer relative mt-6 min-w-0 overflow-hidden rounded-sm border border-border bg-muted" role="region" aria-label={`${label} code example`}>
      <Button
        variant="secondary"
        size="xs"
        aria-label={copyStatus === "copied" ? "Code copied" : copyStatus === "error" ? "Copy failed. Try again" : "Copy code"}
        title={copyStatus === "copied" ? "Copied" : copyStatus === "error" ? "Copy failed" : "Copy code"}
        onClick={copyCode}
        className="absolute right-2 top-2 z-10"
      >
          <Icon svg={copyStatus === "copied" ? checkIcon : copyIcon} className="size-5" />
      </Button>
      {highlighted ? (
        <div dangerouslySetInnerHTML={{ __html: highlighted }} />
      ) : (
        <pre><code>{code}</code></pre>
      )}
      <span role="status" className="sr-only">
        {copyStatus === "copied" ? "Code copied to clipboard" : copyStatus === "error" ? "Could not copy code" : ""}
      </span>
    </div>
  );
}
