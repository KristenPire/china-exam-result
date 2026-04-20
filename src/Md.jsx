/**
 * Lightweight Markdown renderer for exam content.
 *
 * Supports:
 *   - Fenced code blocks (```lang ... ```)  → syntax-highlighted <pre>
 *   - Inline code (`...`)                   → styled <code>
 *   - **bold**                              → <strong>
 *   - Line breaks (\n)                      → <br>
 *   - Bullet lists (lines starting with -)  → <ul><li>
 */

import { useMemo } from "react";
import hljs from "highlight.js/lib/core";
import cpp from "highlight.js/lib/languages/cpp";
import bash from "highlight.js/lib/languages/bash";

hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("c", cpp);
hljs.registerLanguage("bash", bash);

// ── Styles ──

const codeBlockStyle = {
  background: "#322a2d",
  border: "1px solid #4a3a40",
  borderRadius: 4,
  padding: "12px 14px",
  margin: "8px 0",
  overflowX: "auto",
  fontSize: 13,
  lineHeight: 1.55,
  fontFamily: "'Victor Mono', Consolas, monospace",
  fontFeatureSettings: "'liga' 1, 'calt' 1",
};

const inlineCodeStyle = {
  background: "#1a1a3a",
  border: "1px solid #2a2a4a",
  borderRadius: 3,
  padding: "1px 5px",
  fontSize: "0.92em",
  color: "#00d4ff",
  fontFamily: "'Victor Mono', Consolas, monospace",
  fontFeatureSettings: "'liga' 1, 'calt' 1",
};

// ── Helpers ──

const BLOCK_RE = /```(\w*)\n([\s\S]*?)```/g;

function highlight(code, lang) {
  if (lang && hljs.getLanguage(lang)) {
    return hljs.highlight(code, { language: lang }).value;
  }
  return hljs.highlightAuto(code).value;
}

/** Render inline markdown: `code` and **bold** */
function renderInlineTokens(text, keyPrefix) {
  // Match inline code or bold
  const TOKEN_RE = /`([^`]+)`|\*\*([^*]+)\*\*/g;
  const parts = [];
  let last = 0;
  let m;
  while ((m = TOKEN_RE.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      parts.push(
        <code key={`${keyPrefix}-c${m.index}`} style={inlineCodeStyle}>
          {m[1]}
        </code>,
      );
    } else {
      parts.push(
        <strong key={`${keyPrefix}-b${m.index}`} style={{ color: "#f0f0f0" }}>
          {m[2]}
        </strong>,
      );
    }
    last = TOKEN_RE.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

const headingStyle = (level) => ({
  color: level === 1 ? "#f0f0f0" : level === 2 ? "#00d4ff" : "#d4d4d4",
  fontSize: level === 1 ? 17 : level === 2 ? 14 : 13,
  fontWeight: "bold",
  margin: level === 1 ? "14px 0 6px" : "10px 0 4px",
  letterSpacing: "0.03em",
});

const tableStyle = {
  borderCollapse: "collapse",
  margin: "8px 0",
  width: "100%",
  fontSize: 12,
};

const tdStyle = {
  border: "1px solid #2a2a4a",
  padding: "4px 10px",
  verticalAlign: "top",
  color: "#d4d4d4",
};

/** Render a plain-text chunk (no code blocks) into lines, bullets, headings, tables, and inline tokens */
function renderTextBlock(text, keyPrefix) {
  const lines = text.split("\n");
  const result = [];
  let bulletBuffer = [];
  let tableBuffer = [];

  function flushBullets() {
    if (bulletBuffer.length === 0) return;
    result.push(
      <ul
        key={`${keyPrefix}-ul${result.length}`}
        style={{ margin: "4px 0 4px 6px", paddingLeft: 14, listStyleType: "'› '" }}
      >
        {bulletBuffer.map((item, i) => (
          <li key={i} style={{ marginBottom: 2 }}>
            {renderInlineTokens(item, `${keyPrefix}-li${i}`)}
          </li>
        ))}
      </ul>,
    );
    bulletBuffer = [];
  }

  function flushTable() {
    if (tableBuffer.length === 0) return;
    const dataRows = tableBuffer.filter((r) => !/^\|[\s|:-]+\|$/.test(r.trim()));
    result.push(
      <table key={`${keyPrefix}-tbl${result.length}`} style={tableStyle}>
        <tbody>
          {dataRows.map((row, ri) => {
            const cells = row.split("|").slice(1, -1).map((c) => c.trim());
            return (
              <tr key={ri}>
                {cells.map((cell, ci) => (
                  <td key={ci} style={tdStyle}>
                    {renderInlineTokens(cell, `${keyPrefix}-tc${ri}-${ci}`)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>,
    );
    tableBuffer = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table row (starts and ends with |)
    if (/^\|.*\|$/.test(line.trim())) {
      flushBullets();
      tableBuffer.push(line.trim());
      continue;
    }
    flushTable();

    // Headings
    const h3 = line.match(/^### (.+)/);
    const h2 = line.match(/^## (.+)/);
    const h1 = line.match(/^# (.+)/);
    if (h1) {
      flushBullets();
      result.push(<div key={`${keyPrefix}-h1${i}`} style={headingStyle(1)}>{renderInlineTokens(h1[1], `${keyPrefix}-h1t${i}`)}</div>);
      continue;
    }
    if (h2) {
      flushBullets();
      result.push(<div key={`${keyPrefix}-h2${i}`} style={headingStyle(2)}>{renderInlineTokens(h2[1], `${keyPrefix}-h2t${i}`)}</div>);
      continue;
    }
    if (h3) {
      flushBullets();
      result.push(<div key={`${keyPrefix}-h3${i}`} style={headingStyle(3)}>{renderInlineTokens(h3[1], `${keyPrefix}-h3t${i}`)}</div>);
      continue;
    }

    // Horizontal rule
    if (line.trim() === "---") {
      flushBullets();
      result.push(<hr key={`${keyPrefix}-hr${i}`} style={{ border: "none", borderTop: "1px solid #2a2a4a", margin: "10px 0" }} />);
      continue;
    }

    const bulletMatch = line.match(/^[-•]\s+(.*)/);
    if (bulletMatch) {
      bulletBuffer.push(bulletMatch[1]);
    } else {
      flushBullets();
      if (line.trim() === "") {
        result.push(<div key={`${keyPrefix}-sp${i}`} style={{ height: 6 }} />);
      } else {
        result.push(
          <span key={`${keyPrefix}-ln${i}`}>
            {i > 0 && lines[i - 1].trim() !== "" && !lines[i - 1].match(/^[-•]\s+/) && (
              <br />
            )}
            {renderInlineTokens(line, `${keyPrefix}-${i}`)}
          </span>,
        );
      }
    }
  }
  flushBullets();
  flushTable();
  return result;
}

// ── Main component ──

export function Md({ children }) {
  const elements = useMemo(() => {
    if (!children) return null;
    const src = String(children);
    const result = [];
    let last = 0;
    let m;
    const re = new RegExp(BLOCK_RE.source, "g");

    while ((m = re.exec(src)) !== null) {
      if (m.index > last) {
        result.push(
          <span key={`t-${last}`}>
            {renderTextBlock(src.slice(last, m.index), `t${last}`)}
          </span>,
        );
      }
      const lang = m[1] || "";
      const code = m[2].replace(/\n$/, "");
      result.push(
        <pre key={`cb-${m.index}`} style={codeBlockStyle}>
          <code dangerouslySetInnerHTML={{ __html: highlight(code, lang) }} />
        </pre>,
      );
      last = re.lastIndex;
    }

    if (last < src.length) {
      result.push(
        <span key={`t-${last}`}>
          {renderTextBlock(src.slice(last), `t${last}`)}
        </span>,
      );
    }
    return result;
  }, [children]);

  return <>{elements}</>;
}
