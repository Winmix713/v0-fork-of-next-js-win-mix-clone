import type React from "react"
import { cn } from "@/lib/utils"

interface GlassmorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  icon?: string
  variant?: "default" | "export"
}

export function GlassmorphicButton({
  children,
  icon,
  variant = "default",
  className,
  ...props
}: GlassmorphicButtonProps) {
  return (
    <button
      className={cn(
        // Base glassmorphic styling from the provided CSS
        "relative inline-flex items-center justify-center gap-2",
        "w-[130px] h-[40px] rounded-full",
        "font-medium text-white text-sm",
        // Complex glassmorphic background and shadows
        "bg-gradient-to-b from-gray-400/20 via-gray-500/30 to-gray-600/20",
        "backdrop-blur-sm",
        // Multiple shadow layers for depth
        "shadow-[0px_0px_4px_rgba(0,0,0,0.1),0px_2px_17px_rgba(0,0,0,0.12)]",
        // Inset shadows for glassmorphic effect
        "before:absolute before:inset-0 before:rounded-full",
        "before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent",
        "before:shadow-[inset_6px_6px_1px_-7px_rgba(255,255,255,0.75),inset_-6px_-6px_1px_-7px_rgba(255,255,255,0.8)]",
        // Hover effects
        "hover:bg-gradient-to-b hover:from-gray-300/25 hover:via-gray-400/35 hover:to-gray-500/25",
        "hover:shadow-[0px_0px_6px_rgba(0,0,0,0.15),0px_4px_20px_rgba(0,0,0,0.18)]",
        "transition-all duration-300 ease-out",
        "transform hover:scale-105 active:scale-95",
        className,
      )}
      {...props}
    >
      {icon && <i data-lucide={icon} style={{ width: "16px", height: "16px", strokeWidth: "1.5" }} />}
      <span className="relative z-10 font-medium tracking-wide">{children}</span>
    </button>
  )
}
