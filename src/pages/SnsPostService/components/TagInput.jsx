// src/pages/SnsPostService/components/TagInput.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

export function TagInput({
  tags = [],
  onChange,
  placeholder = "태그를 입력하세요",
}) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.nativeEvent.isComposing || e.isComposing) return; // 조합 중이면 무시
    if (e.keyCode === 229) return; // 일부 브라우저 방어

    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) onChange([...tags, newTag]);
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 text-purple-500 hover:text-purple-700"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-5 py-4 border-2 border-gray-400 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 font-bold text-gray-800 placeholder-gray-500 bg-white hover:border-blue-400"
      />

      <p className="text-xs text-gray-500 mt-1">
        Enter 키를 눌러 태그를 추가하세요
      </p>
    </div>
  );
}
