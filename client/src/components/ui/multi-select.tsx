import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchable?: boolean;
}

export function MultiSelect({ 
  options, 
  selected, 
  onChange, 
  placeholder = "Select options...",
  searchable = false 
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOptions = options.filter(option => selected.includes(option.value));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(item => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemoveOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter(item => item !== value));
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className="min-h-[42px] px-3 py-2 border rounded-lg cursor-pointer transition-all duration-300"
        style={{
          borderColor: isOpen ? 'var(--color-mid-gray)' : 'var(--color-light-gray)',
          backgroundColor: 'var(--color-warm-white)'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 flex flex-wrap gap-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map(option => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full"
                  style={{
                    backgroundColor: 'var(--color-cream)',
                    color: 'var(--color-charcoal)',
                    border: '1px solid var(--color-light-gray)'
                  }}
                >
                  {option.label}
                  <button
                    onClick={(e) => handleRemoveOption(option.value, e)}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-sm" style={{ color: 'var(--color-mid-gray)' }}>
                {placeholder}
              </span>
            )}
          </div>
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            style={{ color: 'var(--color-mid-gray)' }}
          />
        </div>
      </div>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-auto"
          style={{
            backgroundColor: 'var(--color-warm-white)',
            borderColor: 'var(--color-light-gray)'
          }}
        >
          {searchable && (
            <div className="p-2 border-b" style={{ borderColor: 'var(--color-light-gray)' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search options..."
                className="w-full px-2 py-1 text-sm border rounded"
                style={{
                  borderColor: 'var(--color-light-gray)',
                  backgroundColor: 'var(--color-warm-white)',
                  color: 'var(--color-charcoal)'
                }}
              />
            </div>
          )}
          
          <div className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-opacity-50 transition-colors"
                  style={{
                    backgroundColor: selected.includes(option.value) ? 'var(--color-soft-beige)' : 'transparent'
                  }}
                  onClick={() => handleToggleOption(option.value)}
                  onMouseEnter={(e) => {
                    if (!selected.includes(option.value)) {
                      e.currentTarget.style.backgroundColor = 'var(--color-cream)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selected.includes(option.value)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div
                    className="w-4 h-4 border rounded flex items-center justify-center"
                    style={{
                      borderColor: selected.includes(option.value) ? 'var(--color-charcoal)' : 'var(--color-light-gray)',
                      backgroundColor: selected.includes(option.value) ? 'var(--color-charcoal)' : 'transparent'
                    }}
                  >
                    {selected.includes(option.value) && (
                      <Check className="w-3 h-3" style={{ color: 'var(--color-warm-white)' }} />
                    )}
                  </div>
                  <span className="text-sm" style={{ color: 'var(--color-charcoal)' }}>
                    {option.label}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm" style={{ color: 'var(--color-mid-gray)' }}>
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}