import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  filters: {
    key: string;
    label: string;
    options: FilterOption[];
  }[];
  activeFilters: Record<string, string[]>;
  onFilterChange: (key: string, values: string[]) => void;
  onClearFilters: () => void;
}

export function FilterBar({ filters, activeFilters, onFilterChange, onClearFilters }: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const hasActiveFilters = Object.values(activeFilters).some(v => v.length > 0);

  const toggleOption = (filterKey: string, value: string) => {
    const current = activeFilters[filterKey] || [];
    const newValues = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFilterChange(filterKey, newValues);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {filters.map((filter) => (
        <div key={filter.key} className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === filter.key ? null : filter.key)}
            className={`filter-chip flex items-center gap-2 ${
              (activeFilters[filter.key]?.length || 0) > 0 ? 'active' : ''
            }`}
          >
            <span>{filter.label}</span>
            {(activeFilters[filter.key]?.length || 0) > 0 && (
              <span className="bg-primary-foreground/20 px-1.5 py-0.5 rounded-full text-xs">
                {activeFilters[filter.key].length}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === filter.key ? 'rotate-180' : ''}`} />
          </button>

          {openDropdown === filter.key && (
            <div className="absolute top-full left-0 mt-2 w-48 glass-card p-2 z-50">
              {filter.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(activeFilters[filter.key] || []).includes(option.value)}
                    onChange={() => toggleOption(filter.key, option.value)}
                    className="w-4 h-4 rounded border-white/20 bg-secondary text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-white">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
          Clear all
        </button>
      )}
    </div>
  );
}
