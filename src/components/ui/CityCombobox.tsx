"use client";

import { useEffect, useRef, useState } from "react";
import { cities } from "@/data/cities";

export default function CityCombobox({
  value,
  onChange,
  placeholder,
  name,
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  name?: string;
  required?: boolean;
}) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = (
    query.trim()
      ? cities.filter((city) =>
          city.toLowerCase().startsWith(query.trim().toLowerCase()),
        )
      : cities
  ).slice(0, 8);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectCity(city: string) {
    setQuery(city);
    onChange(city);
    setIsOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (!isOpen) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((i) => Math.min(i + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (filtered[highlighted]) selectCity(filtered[highlighted]);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full sm:flex-1">
      <input
        type="text"
        name={name}
        required={required}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setIsOpen(true);
          setHighlighted(0);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-xl bg-surface-tint px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint"
      />
      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 z-20 mt-1 w-full overflow-hidden rounded-xl border border-ink/10 bg-surface shadow-lg">
          {filtered.map((city, index) => (
            <button
              key={city}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectCity(city)}
              className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${
                index === highlighted
                  ? "bg-surface-tint text-ink"
                  : "text-ink-soft hover:bg-surface-tint"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
