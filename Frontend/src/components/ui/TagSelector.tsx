import React from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface TagSelectorProps {
  selectedTags: string[];
  availableTags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  allowCustomTags?: boolean;
  className?: string;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  availableTags,
  onTagsChange,
  placeholder = 'Buscar o crear tags...',
  maxTags,
  allowCustomTags = true,
  className = '',
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const filteredSuggestions = React.useMemo(() => {
    if (!inputValue) return availableTags.filter(tag => !selectedTags.includes(tag));
    
    return availableTags
      .filter(tag => 
        !selectedTags.includes(tag) && 
        tag.toLowerCase().includes(inputValue.toLowerCase())
      );
  }, [inputValue, availableTags, selectedTags]);

  const addTag = (tag: string) => {
    if (!tag || selectedTags.includes(tag) || (maxTags && selectedTags.length >= maxTags)) {
      return;
    }

    onTagsChange([...selectedTags, tag]);
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        if (allowCustomTags) {
          addTag(inputValue.trim());
        } else if (filteredSuggestions.includes(inputValue.trim())) {
          addTag(inputValue.trim());
        }
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="border border-gray-300 rounded-md p-2 min-h-[40px] flex flex-wrap gap-1 items-center focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500\">
        {selectedTags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800\"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 inline-flex items-center p-0.5 rounded-full text-blue-600 hover:bg-blue-200 hover:text-blue-800\"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={selectedTags.length === 0 ? placeholder : ''}
          className="border-none shadow-none p-0 flex-1 min-w-[100px] focus:ring-0"
          disabled={maxTags ? selectedTags.length >= maxTags : false}
        />
      </div>

      {showSuggestions && (filteredSuggestions.length > 0 || (allowCustomTags && inputValue)) && (
          {filteredSuggestions.map((tag, index) => (
            <button
              key={index}
              type="button"
              onClick={() => addTag(tag)}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              {tag}
            </button>
          ))}
          
          {allowCustomTags && inputValue && !availableTags.includes(inputValue.trim()) && (
            <button
              type="button"
              onClick={() => addTag(inputValue.trim())}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear "{inputValue.trim()}"
            </button>
          )}
        </div>
      )}
      
      {/* Click outside to close suggestions */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};