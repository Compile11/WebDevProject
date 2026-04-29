import { useRef } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
} from "lucide-react";

function insertAtCursor(textarea, before, after = "") {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  const selected = textarea.value.substring(start, end);

  const newText =
    textarea.value.substring(0, start) +
    before +
    selected +
    after +
    textarea.value.substring(end);

  return {
    text: newText,
    cursor: start + before.length + selected.length + after.length,
  };
}

export default function MarkdownEditor({ content, setContent }) {
  const textareaRef = useRef(null);

  const applyFormat = (before, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { text, cursor } = insertAtCursor(textarea, before, after);

    setContent(text);


    // placeholder for cursor state
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(cursor, cursor);
    }, 0);
  };

  return (
    <div className="border border-gray-700 rounded-lg bg-gray-900">
      
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-700 bg-gray-800 rounded-t-lg">

        <button
          onClick={() => applyFormat("**", "**")}
          className="p-2 hover:bg-gray-700 rounded"
          title="Bold"
        >
          <Bold size={16} />
        </button>

        <button
          onClick={() => applyFormat("*", "*")}
          className="p-2 hover:bg-gray-700 rounded"
          title="Italic"
        >
          <Italic size={16} />
        </button>

        <button
          onClick={() => applyFormat("~~", "~~")}
          className="p-2 hover:bg-gray-700 rounded"
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </button>

        <div className="w-px bg-gray-600 mx-1" />

        <button
          onClick={() => applyFormat("`", "`")}
          className="p-2 hover:bg-gray-700 rounded"
          title="Inline Code"
        >
          <Code size={16} />
        </button>

        <button
          onClick={() => applyFormat("\n```insert_language\n", "\n```\n")}
          className="p-2 hover:bg-gray-700 rounded text-xs font-mono"
          title="Code Block"
        >
          {"</>"}
        </button>
      </div>

      <div className="border border-gray-700 rounded bg-gray-900 px-3 py-2 min-h-[150px] flex">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Body"
          className="flex-1 bg-transparent text-gray-100 outline-none resize-none leading-relaxed"
          required
        />
      </div>
    </div>
  );
}