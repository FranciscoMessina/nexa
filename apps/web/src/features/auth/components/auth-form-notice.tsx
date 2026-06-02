import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

type AuthFormNoticeProps = {
  children: ReactNode
  className?: string
  "data-testid"?: string
  variant?: "info" | "success"
}

export function AuthFormNotice({
  children,
  className,
  "data-testid": testId,
  variant = "info",
}: AuthFormNoticeProps) {
  return (
    <p
      className={cn(
        "rounded-xl border px-3 py-2 text-sm",
        variant === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-[#d9e2f0] bg-[#f4f7fb] text-[#4a6086]",
        className
      )}
      data-testid={testId}
    >
      {children}
    </p>
  )
}
