import { useState, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable tag input component
 * - Enter or comma to add tag
 * - Click X to remove tag
 * - Backspace to remove last tag when input is empty
 */
export default function TagInput({
  tags = [],
  onChange,
  placeholder = 'Type and press Enter',
  className = '',
}) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const addTag = (value) => {
    const trimmedValue = value.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onChange([...tags, trimmedValue]);
    }
    setInputValue('');
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      removeTag(tags.length - 1);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    // If comma is typed, add the tag before the comma
    if (value.includes(',')) {
      const parts = value.split(',');
      parts.forEach((part, index) => {
        if (part.trim() && index < parts.length - 1) {
          addTag(part);
        }
      });
      // Keep the text after the last comma in input
      setInputValue(parts[parts.length - 1]);
    } else {
      setInputValue(value);
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className={`flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg bg-white cursor-text min-h-[42px] focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200 transition-all ${className}`}
      onClick={handleContainerClick}
    >
      {/* Render existing tags */}
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 rounded-md text-sm font-medium"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(index);
            }}
            className="hover:text-primary-900 focus:outline-none"
            aria-label={`Remove ${tag}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}

      {/* Input for new tags */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
      />
    </div>
  );
}
