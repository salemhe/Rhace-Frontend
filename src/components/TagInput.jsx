import { Plus, X } from "lucide-react";
import { useState } from "react";

const TagInput = ({ label, placeholder, tags, onAdd, onRemove }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2">
        <input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          className="flex-1 h-11 px-3 rounded-md border border-[#0A6C6D] bg-white text-black text-sm placeholder-gray-400 focus:outline-none focus:border-[#0A6C6D] focus:ring-1 focus:ring-[#0A6C6D] transition-all"
        />
        <button
          onClick={handleAdd}
          className="h-11 px-4 rounded-md bg-[#0A6C6D] text-white hover:bg-[#085555] transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {tag}
              <button
                onClick={() => onRemove(tag)}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput