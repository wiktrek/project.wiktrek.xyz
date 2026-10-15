import { useEffect, useState } from "react";

const KEY = "slopos-notes";

export function Notes() {
  const [text, setText] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setText(localStorage.getItem(KEY) ?? "");
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, text);
  }, [text, loaded]);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="flex h-full flex-col bg-[#fdf6d8]/[0.04]">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing... (saved automatically)"
        spellCheck={false}
        className="placeholder:text-text-600 flex-1 resize-none bg-transparent p-4 text-[15px] leading-7 text-amber-50 outline-none"
      />
      <div className="text-text-500 flex justify-between border-t border-white/5 px-4 py-1.5 text-xs">
        <span>{words} words</span>
        <span>{text.length} characters</span>
      </div>
    </div>
  );
}
