"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({ value, onChange, placeholder = "Keresés...", className = "" }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    if (typeof window !== "undefined" && window.lucide) {
      window.lucide.createIcons()
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    onChange(newValue)
  }

  const handleClear = () => {
    setLocalValue("")
    onChange("")
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i
          data-lucide="search"
          className="text-zinc-400"
          style={{ width: "18px", height: "18px", strokeWidth: "1.5" }}
        ></i>
      </div>
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-colors duration-200"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white transition-colors duration-200"
        >
          <i data-lucide="x" style={{ width: "18px", height: "18px", strokeWidth: "1.5" }}></i>
        </button>
      )}
    </div>
  )
}
