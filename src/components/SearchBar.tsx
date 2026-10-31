
import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { WorldClock } from '../types/clock'

interface SearchBarProps {
  value: string
  suggestions: WorldClock[]
  onChange: (value: string) => void
  onSelect: (clock: WorldClock) => void
}

function SearchBar({
  value,
  suggestions,
  onChange,
  onSelect,
}: SearchBarProps) {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)

  const suppressNextOpen = useRef(false)

  useEffect(() => {
    setActiveIndex(-1)

    if (suppressNextOpen.current) {
      suppressNextOpen.current = false
      return
    }

    setIsOpen(value.trim().length > 0)
  }, [value])

  function selectClock(clock: WorldClock) {
    suppressNextOpen.current = true
    setIsOpen(false)
    setActiveIndex(-1)
    onSelect(clock)
  }

  function handleChange(newValue: string) {
    onChange(newValue)
    setIsOpen(newValue.trim().length > 0)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
      return
    }

    if (!isOpen || suggestions.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex(index =>
        index < suggestions.length - 1 ? index + 1 : 0
      )
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex(index =>
        index > 0 ? index - 1 : suggestions.length - 1
      )
    }

    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      selectClock(suggestions[activeIndex])
    }
  }

  return (
    <div className="search-wrapper">
      <div className="search-container">
        <span className="search-icon">⌕</span>

        <input
          type="search"
          value={value}
          onChange={event => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (value.trim()) setIsOpen(true)
          }}
          placeholder="Search any city or time zone..."
          aria-label="Search cities and time zones"
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />

        {value && (
          <button
            type="button"
            className="clear-search"
            onClick={() => {
              handleChange('')
              setIsOpen(false)
            }}
            aria-label="Clear search"
          >
            ×
          </button>
        )}

        {!value && (
          <span className="search-shortcut">
            GLOBAL SEARCH
          </span>
        )}
      </div>

      {isOpen && (
        <div className="search-suggestions">
          {suggestions.length > 0 ? (
            suggestions.map((clock, index) => (
              <button
                type="button"
                key={clock.timezone}
                className={`suggestion-item ${
                  activeIndex === index ? 'active' : ''
                }`}
                onMouseDown={event => event.preventDefault()}
                onClick={() => selectClock(clock)}
              >
                <span className="suggestion-icon">◷</span>

                <span className="suggestion-details">
                  <strong>{clock.city}</strong>
                  <small>{clock.timezone}</small>
                </span>

                <span className="suggestion-region">
                  {clock.region}
                </span>
              </button>
            ))
          ) : (
            <div className="suggestion-empty">
              No matching locations found.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
